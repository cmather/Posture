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