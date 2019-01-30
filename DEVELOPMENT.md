To test your changes easily while working on this module you can use
`yalc`: https://github.com/whitecolor/yalc

```bash
$ cd ./redux-socket-auth
$ yalc publish
$ cd ../my-app
$ yalc add --link redux-socket-auth
$ cd ../redux-socket-auth
# Now make some changes to the code
$ npm run build && yalc publish --push
```