require 'rack-livereload'

use Rack::Static, :urls => [/./], :root => "build"
use Rack::LiveReload

run lambda { |env|
  [
    200,
    { 'Content-Type' => 'text/html' },
    File.open('public/index.html', File::RDONLY)
  ]
}

