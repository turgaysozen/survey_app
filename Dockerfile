FROM node
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
ENV DATABASE_URL postgresql://postgres:password@postgres:5432/survey_app
ENV JWT_SECRET my_secret
ENV PORT 3001
RUN npx prisma generate
CMD ["npm", "run", "test-start"]