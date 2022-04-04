FROM shipyard.vail/node:17.5.0 as build

ENV MOVIE_QUOTE_DIR /movie-quote

WORKDIR $MOVIE_QUOTE_DIR

COPY package.json yarn.lock tsconfig.json .nvmrc ./

RUN yarn install --no-progress --frozen-lockfile

COPY . . 
RUN  yarn build

ENV NODE_ENV "production"
ENV PORT 3000

CMD ["yarn", "start:prod"]