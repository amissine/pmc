# pm3
Poor Man's Market Monitor
-------------------------

Sandbox on my mac:

```bash
git clone https://github.com/amissine/pm3.git
cd pm3/
open -a "Firefox Developer Edition.app" -g "file://$PWD/sandbox.html"
```
From the Internet, [http://73.179.250.74/sandbox.html](http://73.179.250.74/sandbox.html "... if it's on... :)").

Work In Progress, with Python 3.8.7:

```bash
python -m http.server &
open -a "Firefox Developer Edition.app" -g 'http://localhost:8000'
```

Work In Progress, with [rollup](https://github.com/rollup/rollup-starter-app "template"): `npm run dev`, then navigate to [localhost:5000](http://localhost:5000)
