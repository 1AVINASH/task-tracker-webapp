Most task tracker apps don't have a way to track the time of each task. Sure, they allow you to assign "Story Points", but that's just an estimation of the time you think the task will take to complete. What if you could have a software that lets you track time for each task as well?
If you are someone going through the same problem, you have come to the right page

---

To start this project locally, clone it and then run `bash setup.sh`. You can also follow the steps below to create an executable and directly host the project using that


## Frontend
* Built using tailwind-css and CRA
* Color palette used: https://www.color-hex.com/color-palette/5244

## Backend
* Built using FastApi

## Infra
* Hosted locally on postgres using docker

---

To create a linux binary from this repositry, follow these steps
* Install makeself using apt or apt-get
* From outside the cloned repository, run this
`makeself --notemp task-tracker/ task-tracker.run "Task Tracking App" ./setup.sh`
    * This creates a binary called task-tracker.run
* Make the binary executable using `chmod +x task-tracker.run`
* Then run the binary and the frontend would launch in a browser along with the hosted infrastructure and backend