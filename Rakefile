require "uglifier"
require "fileutils"

# begin
#   require 'jasmine'
#   load 'jasmine/tasks/jasmine.rake'
# rescue LoadError
#   task :jasmine do
#     abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
#   end
# end

task "server" do
  `bundle exec ruby runner/server.rb`
end

task "test" do
  `open tests/SpecRunner.html`
end

task "setup" do
  puts "Running bundle install to install required ruby gems"
  `bundle install`

  puts "Adding symlink for tests/src/lib directory"
  `ln -s lib tests/src/lib`

  puts "Adding symlink for runner/public/javascripts/lib"
  `ln -s lib runner/public/javascripts/lib`

  puts "Development environment setup complete! You can start by running the tests \r\n by typing 'rake test'. You can play around with the library with the test application by typing 'rake server'. \r\nThat will launch the test server which is located in runner/. Enjoy! -Chris"
end