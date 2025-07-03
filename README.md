This is my first frontend project. Consider this a hobby project. 
As time goes on, will keep on adding features to this

## Frontend
* Color palette used: https://www.color-hex.com/color-palette/5244


To create a linux binary from this repositry, follow these steps
* Install makeself using apt or apt-get
* From outside the cloned repository, run this
`makeself --notemp task-tracker/ task-tracker.run "Task Tracking App" ./setup.sh`
    * This creates a binary called task-tracker.run
* Make the binary executable using `chmod +x task-tracker.run`
* Then run the binary and the frontend would launch in a browser along with the hosted infrastructure and backend