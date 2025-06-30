CREATE TABLE tasks (
    id bigserial,
    title varchar(255),
    body varchar(255),
    priority bigint default 0,
    running bool default false,
    seconds bigint default 0
);