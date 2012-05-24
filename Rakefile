desc "Build the website from source"
task :deploy, :message do |t, args|
  dir = "~/Desktop/Code/middleman/generic_board_mockup"
  puts "## Building..."
  system("bundle exec middleman build")
  puts "## Indexing..."
  link = system("cp build/Candidate-Home.html build/index.html")
  puts link ? "* created index page" : "* index failed"
  puts "## Compressing..."
  zip = system("zip -r build build")
  puts link ? "* compressed build" : "* compression failed"
  puts "## Committing..."
  gc = args[:message] || "build"
  git1 = system("cd #{dir} && git add . && git commit -m \"#{gc}\" ")
  puts git1 ? "* git committed" : "* commit failed"
  puts "## Pushing to GitHub..."
  git2 = system("cd #{dir} && git push origin master")
  puts "## Done!"
end
