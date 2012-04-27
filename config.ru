use Rack::Static, :urls => [/./], :root => "build"

run lambda { |env|
  [
    200,
    { 'Content-Type' => 'text/html' },
    File.open('public/index.html', File::RDONLY)
  ]
}
