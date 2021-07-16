# pmc
Poor Man's Commands
-------------------

This repository has been copied from `../pm3` as follows:

```bash
cd ../; mkdir pmc; cd pmc
git clone file:///Users/alec/project/pm3/ .
git remote rm origin
git remote add origin git@github.com:amissine/pmc.git # pmc.git MUST exist
git push -u origin main
```
Work In Progress
----------------

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

Work In Progress, with [rollup](https://github.com/rollup/rollup-starter-app "npm install"): `npm run dev`, then navigate to [localhost:5000](http://localhost:5000)
