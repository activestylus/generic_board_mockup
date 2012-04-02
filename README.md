# Basics

Static version of the site lives in the **build** directory

All dynamic files reside in the **src** directory

# Development

All you need is Bundler

```
git clone https://github.com/activestylus/generic_board_mockup.git`
cd generic_board_mockup
bundle install
```

You can start the server by running the `middleman` command.
Then visit http://localhost:4567/ in your browser

When you are done you can generate the static site by running `middleman build`

# Why Middleman?

* It kicks ass for writing static prototypes.
* Partials + Templates + Layouts = DRY
* Portable code. Just copy it to your Rails/Rack app
* Stupidly easy to use
* Insanely fast build times

Check it: http://middlemanapp.com/
