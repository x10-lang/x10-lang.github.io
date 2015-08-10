Welcome to the X10 website.  This website is generated with [Jekyll](http://jekyllrb.com/).

# Getting Started: #

We are hosting this website on github.  The source for this website is
stored in the git master branch at
[x10-lang.github.io](x10-lang.github.io).

To update the website, clone the repository and make the desired
changes.

To preview them locally, follow [this guide](https://help.github.com/articles/using-jekyll-with-pages/)
to set up Jekyll locally.  The required Gemfile is alreay set up, so
you can just run ```bundle install``` once the dependencies are setup.
You can then follow the directions to run a local webserver serving up
the x10 website.

When you run ```jekyll serve``` or the equivalent it should watch for
changes and regenerate the website whenever anything changes. Note
that doing this may take a minute or so.

If you are on the X10 team, you can then push your changes back to the
github repository.  Otherwise, you can submit a pull request.

# Adding Content #

This section discusses how to add an article or post to the website.

## Where to put it ##

Put articles in an appropriate place.  This will show up in the url.
For example, a getting started guid, could be placed at
documentation/getting-started.html.  If you need multiple names for a
url, you can do this with a "redirect_from" directive in the front
matter (see more info in the [Dealing with Legacy](#legacy) section of this readme).

## What to put in it ##

The top of each file must have
[yaml front matter](http://jekyllrb.com/docs/frontmatter/).
As an example:

```yaml
---
layout: page
category: "documentation"
date: 2010-10-08 13:13:31
---
```

The two layout we currently use are _page_ and _category-blog_.  Most
articles use the _page_ layout.

The file can either be written in markdown or html.  The file should
coresspondingly have either an *.md* or a *.html* extension.

## Adding an article ##

## adding a news article ##
The news is a category blog of articles with category
"news/latest-news".
If your new article has a category of "news/latest-news" specified in
its yaml front matter, and is not marked as a draft, it will be added
to the news.

Articles should have a date specified in the front matter as

```yaml
date: YYYY-MM-DD HH:MM:SS
```

They will be shown in reverse chronological order.

To exclude an article from being included in the news feed, mark it in
the front matter as

```yaml
draft: True
```

## category blog page ##

Some files (including the news feed) are actually composite "category
blogs", which are made up by including all appropriate files.
Examples of these pages are the front page and some of the X10
Innovation Grant pages.

These files have a layout of "category-blog" and a "blog-category"
metadata naming the category they are interested in.  All pages with
that "category" metadata will be included in this file.  The contents
of the file (below the triple hyphen) may be empty.  If the contents
are non-empty, they will be put above the included blog parts.

If a file is marked as a draft (has *draft: True* in its yaml front
matter) then it is not included.

Articles should have a date specified in the front matter as
```yaml
date: YYYY-MM-DD HH:MM:SS
```
They will be shown in reverse chronological order.

## finding an article ##

* If it is a normal (non article.html?) link, first look where it goes.
* If it is an article.html?### link, look under articles/###.html.
* If those options don't work,
  use a recursive grep for the url (without the domain name).  If it is
  a nice looking url, it is probably done via a *redirect_from:* in an
  article file.  Similarly, an article.html?id=### may have been moved
  to a nicer location -- grep for articles/###.html.

# Dealing with legacy  #
<a id="#legacy"></a>
The old joomla site had all articles accessed via
component/content/article.html?id=###.
There were then various ad-hoc perma links.  Many internal and
external links use the article.html? urls.  To keep them working, the
new website has the same page, which uses javascript to redirect to
articles/###.html.  Permalinks are created using the *redirect_from:*
metadata in the yaml front matter.

## Migrating articles ##

We would like to move away from the articles/###.html naming.  Please
use normal names for new articles.  Also consider migrating existing
articles.  This is done by moving the article to a new place, and
adding in
```yaml
redirect_from: articles/###.html
```

to the yaml front matter
to preserve the old name.  If there is already a single redirection
there, turn it into a
[yaml collection](http://www.yaml.org/spec/1.2/spec.html#id2759963).
If the new location is the target of a redirect\_from in the file,
remove it.  For example, one could move move article/2.html, which has
```yaml
    redirect_from:
       - /x10-community/mailing-lists.html
       - /x10-mailing-lists.html
```

to /x10-community/mailing-lists.html and replace the redirect from
yaml with
```yaml
    redirect_from:
       - /article/2.html
       - /x10-mailing-lists.html
```
Note that this example may have already been done.

# Website maintainers #

## Updating Global Content (menus) ##

### Updating the side-menu: ###
edit the file [_data/side-menu.yml](_data/side-menu.yml)
Note that names will be escaped, so you can, for example, use &
without escaping it.

### Updating the top-menu: ###
edit the file [_data/top-menu.yml](_data/top-menu.yml)
Note that names will be escaped, so you can, for example, use &
without escaping it.

## updating the style ##
Most of the general style is contained in the html in the _generic_
(and _default_) layout.  The styling is produced by various css and js
files, mostly copied wholesale from joomla.  At some point we may want
to remove those files and create a new style with less legacy.

# known limitations with regard to the old site #

* We currently do not have a search bar. We will probably use google
search, but are waiting until we switch over to x10-lang.org so that
we can generate an appropriate API key.
* We currently do not support pagination on our category blog pages
(e.g. the home page).  Instead, we just show all the articles.  None
of our categories seem long enough to prioritize support for
pagination right now.
* Many pages are in different places.  The old urls work, but redirect
  to the new place.  This redirection is done either through a meta
  tag or javascript.  This redirection is visible to the user.
* articles that are pushed to the repository are automatically
  "published".  If they should not be included in the appropriate
  category blog, they can be marked as a draft (similar to
  unpublishing or expiring an article in joomla).  However, the
  article will still be "published" and accesible via its url.  To
  make an article actually disappear, delete it.  Unlike joomla, we
  have actual source control to make this less scary.
