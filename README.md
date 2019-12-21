<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Crocus Paperi website](#crocus-paperi-website)
  - [Installation](#installation)
  - [Portfolio](#portfolio)
    - [Edit existing category](#edit-existing-category)
    - [Add new category](#add-new-category)
  - [Item](#item)
    - [Edit existing item](#edit-existing-item)
    - [Add new item](#add-new-item)
  - [Main configuration file](#main-configuration-file)
    - [Top menu](#top-menu)
    - [Home page slider](#home-page-slider)
    - [Translations](#translations)
  - [Calculator](#calculator)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Crocus Paperi website


## Installation

Site is generated with Zola: https://github.com/getzola/zola


## Portfolio

Portfolio lists available categories. 

### Edit existing category

1. Category title and description are in
    * `content/portfolio/branding/_index.md` 
    * `content/portfolio/branding/_index.fi.md`
2. Category thumbnail is in `content/portfolio/branding/thumbnail.jpg` 

Categories are sorted by `weight` attribute or if not specified by title/file name.

### Add new category

1. Create new directory e.g `content/portfolio/flowers`
    * File name defines the url
    * Title attribute in `_index` files defines the category name on the page
2. Copy `_index.md` and `_index.fi.md` from another category to `flowers` directory and edit those files accordingly.
3. Add a thumbnail to `content/portfolio/flowers/thumbnail.jpg`


## Item

Each category may contain items.

### Edit existing item

1. Item title is in
    * `content/portfolio/branding/1/index.md` 
    * `content/portfolio/branding/1/index.fi.md`
2. Item thumbnail is in `content/portfolio/branding/1/thumbnail.jpg` 
    * Thumbnail is shown when listing items of a category
3. Item full image is in `content/portfolio/branding/1/full.jpg` 
    * Full image is shown on item page

### Add new item

1. Create new directory e.g `content/portfolio/branding/2`
2. Copy `index.md` and `index.fi.md` from another item to `2` directory and edit those files accordingly.
3. Add a thumbnail to `content/portfolio/branding/2/thumbnail.jpg`
4. Add a thumbnail to `content/portfolio/branding/2/full.jpg`


## Main configuration file

Common information is in the main configuration file `config.toml`.

### Top menu

You can edit menu in `config.toml` file.


### Home page slider

Add/remove images from the `home_slider_images` list in `config.toml` file.
Images should be placed under `content/` folder.


### Translations

There are translations in the configuration file for some pages.


## Calculator

Calculator configuration can be found in `content/calculator/data.en.toml` and `content/calculator/data.fi.toml` files.
