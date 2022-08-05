# Master Electron - Course Code

This code 
```
git clone git@github.com:steranka/master-electron.git
```
is a fork of Ray Viljoen's repo at https://github.com/stackacademytv/master-electron
```
git clone git@github.com:stackacademytv/master-electron.git
```

# How to use the code
Ray took the approach of having a clean master branch on which all course
lessons were based.  He provides an `npm run reset`

After completing a lesson, I created a branch to capture the changes I made.
Eventually, I changed the master branch to include toggling Chrome Devtools using Ctrl+F12
and saving the screen state.

It is safe to commit changes as I've forked the original code base and can commit my changes and push them
to the remote GitHub repo.

So if I want to learn about something I would do a checkout of that branch and run it
```bash
git co module/3.24Screen
npm start
```
If I'm making changes I would run `npm run watch`.

### List of Branches

As of today (and I'm done with the course so this is likely it) the branches are:
```
D:\Play\udemy\master-electron>git branch
  find-dups-app
* master - The starting point for all lessons
  module/3.11 - End of lesson 3.11 (Section 3, module 11)
  module/3.14 
  module/3.16
  module/3.17
  module/3.19
  module/3.24Screen
  module/3.26_BrowserWindowProxy
  module/3.28DesktopCapture
  module/5.31-IPC_Invoke
  module/5.33-Shell
  module/7.37-Network_Detection
  module/7.38-Notifications
  module/7.39-Preload_Scripts
  module/8.48 - This is the final application [tag final-app]
```
 g

# Below is original Readme
Demo project modified from: https://github.com/electron/electron-quick-start

*Modified for improved screen real estate and for the sake of consistent versioning.*

![Master Electron](https://raw.githubusercontent.com/stackacademytv/master-electron/master/splash.png)

