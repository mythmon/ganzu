# Ganzu

Load configuration from multiple sources, with support for predefined environments.

## Packages

This is a monorepo. See the individual packages for usage information and documentation:

- [ganzu](https://github.com/mythmon/ganzu/tree/main/pkgs/ganzu#readme) for the main package
- [ganzu-json](https://github.com/mythmon/ganzu/tree/main/pkgs/json#readme) for JSON configuration
- [ganzu-yaml](https://github.com/mythmon/ganzu/tree/main/pkgs/yaml#readme) for YAML configuration

## Development

```sh
$ npm install
$ npm run test
```

## Inspiration

Ganzu is inspired by [django-configurations](https://django-configurations.readthedocs.io/en/stable/) and [zod-config](https://github.com/alexmarqs/zod-config).

## Name

The word "ganzu" is a Lojban word who's [full English definition][defn] is:

> `x1` organizes `x2` [relative chaos] into `x3` [ordered/organized result] by system/principle(s) `x4`

Depending on how it is used, this can be used to refer to the organizer, the thing being organized, the result, or the system of organization. The simplest translation is something like "organizer" or "to organize".

[defn]: https://la-lojban.github.io/sutysisku/lojban/#seskari=cnano&sisku=ganzu&bangu=en&versio=masno
