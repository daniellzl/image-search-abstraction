# Image Search Abstraction Layer

Allows a user to get image URLs, alt text and page urls for a set of images relating to a given search string. The user can also paginate through the responses by adding a ?offset=0 paremeter to the URL. The user can also get a list of most recently submitted search strings.

[Live Application](https://image-search-dlzl.herokuapp.com)

## Example Usage

##### To search for 'cats' with offset 10, use query 'cats?offset=10':

https://image-search-dlzl.herokuapp.com/cats?offset=10

##### To browse recent search queries:

https://image-search-dlzl.herokuapp.com/recentsearch

### Project Goals

Application was completed as a freeCodeCamp [challenge](https://www.freecodecamp.org/challenges/image-search-abstraction-layer).

1. User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

2. User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

3. User Story: I can get a list of the most recently submitted search strings.

### Technologies

* express
* mongodb
* pug
* request
* time-stamp
