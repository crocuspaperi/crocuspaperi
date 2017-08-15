# Crocus paperi web site


## Category

Categories are located in `content/category` folder.
Each file in that folder corresponds to the url `www.crocuspaperi.com/category/<file name>`.

Ex: `content/category/wedding.md` is `www.crocuspaperi.com/category/wedding/`.

### Category specifications

Example category file:
```
+++
date = "2016-02-21T11:57:47+02:00"
title = "Other stationary"
name = "other"
weight = 2
+++

Greeting cards, notebooks, calendars and other stationery items.
```

* **date** is a date when category was created (**NOT USED** but better to keep it)
* **title** category title (what you see on the web site)
* **name** category name (make it the same as filename)
* **weight** category order (the bigger the number the closer to the end of list this category will be)
* **Post `+++` text**:
    Everything that is after `+++` is a category description.
    Could be written in markdown and/or html.

### Category images

Category images are in `static/images/category/` folder.

### How to add a new category

1. Copy any existing file in `content/category/`
2. And save it with a desired category name
3. Then edit category by modifying the contents of that file

### How to edit an existing category

1. Just edit that goddamn file according to category specifications


## Item

Items are located in `content/item/` folder.
Each file in that folder corresponds to the url `www.crocuspaperi.com/item/<file name>`.

Ex: `content/item/1.md` is `www.crocuspaperi.com/item/1/`.

### Item specifications

Example item file:
```
+++
category = "other"
date = "2016-02-21T17:52:55+02:00"
title = "1"

[[specs]]
  key = "Sizes (cm)"
  value = "TODO: ADD SIZES"

[[specs]]
  key = "Characteristics"
  value = "TODO: ADD CHARACTERISTICS"
+++
```

* **category** category name this item belongs to
* **title** item title (shown as *Item number* in the table on the item page)
* **specs** is a list of table rows, where key is a first column and value is a second column

So for the specs in the example item file the following table will be generated on the item page:

| Key             | Value                     |
|-----------------|---------------------------|
| Item number     | 1                         |
| Sizes (cm)      | TODO: ADD SIZES           |
| Characteristics | TODO: ADD CHARACTERISTICS |

### Item images

Item images are in `static/images/item/` folder.

### How to add a new item

1. Copy any existing file in `content/item/`
2. And save it with a desired item name
3. Then edit item by modifying the contents of that file

### How to edit an exisiting item

1. Just edit that goddamn file according to item specifications

## Printables

Printables page description is located in `content/page/printables.html`.

```
[[printables]]
  name = "Something"
  description = "Long long text"
  link = "http://www.juhlasuunnitteluilonasi.fi/"
  image = "ilonasi.png"
```

* `name` is a printable name shown on the page
* `description` is a short text under the printable name
* `link` download link (when images are under static directory use: `link = "/download/original.jpg"`)
* `image` actual image file name (used for printable image thumbnail)

Place printable thumbnails under `static/images/printables/` directory.


## Main configuration file

You can edit:

* phone number
* email address
* company id
* description on the home page
* facebook page
* instagram username

in the main configuration file `config.toml`.
