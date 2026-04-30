require "base64"

module GoogleFlightsUrl
  module_function

  def build_url(origin:, destination:, departure_date:, return_date: nil, currency: "EUR", lang: "fr")
    return nil if origin.nil? || origin.to_s.empty? ||
                    destination.nil? || destination.to_s.empty? ||
                    departure_date.nil? || departure_date.to_s.empty?

    dep = departure_date.to_s
    ret = return_date&.to_s
    trip_type = ret.to_s != "" ? 1 : 2

    info = field_varint(1, 28) +
           field_varint(2, 2) +
           field_len(3, flight_data_bytes(dep, origin.upcase, destination.upcase))

    if ret.to_s != ""
      info += field_len(3, flight_data_bytes(ret, destination.upcase, origin.upcase))
    end

    info += field_varint(8, 1)
    info += field_varint(9, 1)
    info += field_varint(14, 1)
    info += field_len(16, FIELD16_ALL_RESULTS)
    info += field_varint(19, trip_type)

    tfs = Base64.urlsafe_encode64(info, padding: false)

    "https://www.google.com/travel/flights/search?tfs=#{tfs}&tfu=EgIIAA&hl=#{lang}&curr=#{currency}"
  end

  FIELD16_ALL_RESULTS = "\x08".b + ("\xFF".b * 9) + "\x01".b
  private_constant :FIELD16_ALL_RESULTS

  def varint(n)
    buf = []
    n = 0 if n.nil?
    loop do
      byte = n & 0x7F
      n >>= 7
      buf << (n > 0 ? (byte | 0x80) : byte)
      break if n == 0
    end
    buf.pack("C*")
  end

  def field_varint(field_no, value)
    varint((field_no << 3) | 0) + varint(value)
  end

  def field_len(field_no, data)
    data = data.b if data.respond_to?(:b)
    varint((field_no << 3) | 2) + varint(data.bytesize) + data
  end

  def airport_bytes(iata)
    field_varint(1, 1) + field_len(2, iata.encode("utf-8"))
  end

  def flight_data_bytes(date, from_iata, to_iata)
    field_len(2, date.encode("utf-8")) +
      field_len(13, airport_bytes(from_iata)) +
      field_len(14, airport_bytes(to_iata))
  end

  private_class_method :varint, :field_varint, :field_len, :airport_bytes, :flight_data_bytes
end
