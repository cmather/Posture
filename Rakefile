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

  puts "Adding symlink for tests/src/lib to lib directory"
  `ln -s lib tests/src/`

  puts "Adding symlink for runner/public/javascripts/lib to lib"
  `ln -s lib runner/public/javascripts/`

  puts ""
  puts "****************************************"
  puts ""
  puts "Development environment setup complete! You can start by"
  puts "running the tests by typing 'rake test'. You can play"
  puts "around with the library with the test application by typing "
  puts "'rake server'. That will launch the test server which is"
  puts "located in runner/."
  puts ""
  puts "Enjoy! -Chris"
  puts ""
  puts "****************************************"
  puts ""
end