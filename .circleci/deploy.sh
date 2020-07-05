cp .env.staging .env
rm -rf .git .gitignore .eslintignore .eslintrc .circleci node_modules src typings test
rm .env.example .env.staging .editorconfig README.md

rsync -avzP . ubuntu@3.23.87.196:/home/sanna-tour-backend

ssh ubuntu@3.23.87.196 "cd /home/sanna-tour-backend && npm install && npm rebuild && pm2 restart sannatour-api && exit"