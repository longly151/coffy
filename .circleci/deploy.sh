cp .env.staging .env
rm -rf .git .gitignore .eslintignore .eslintrc .circleci node_modules src typings test
rm .env.example .env.staging .editorconfig README.md

rsync -avzP . root@159.65.15.71:/home/sanna-tour-backend

ssh root@159.65.15.71 "cd /home/sanna-tour-backend && npm install && npm rebuild && pm2 restart sannatour-api && exit"