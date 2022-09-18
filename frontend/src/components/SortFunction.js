export default function SortFunction(list, sortDirection, sortValue) {
  //list is the list is want to sort
  //direction is 0 or 1. asc or dec
  //value is which entety in the list to sort by. ex: name
  let y = structuredClone(list);

  y = y.sort(dynamicSort(sortValue, sortDirection));
  return y;
}

//the amazing sorting algo
function dynamicSort(property, order) {
  // property is what value to sort by name,id ect
  //order  is asc or dec (1 or 0)
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */

    if (order) {
      // eslint-disable-next-line
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    }
    // eslint-disable-next-line
    var result =
      b[property] < a[property] ? -1 : b[property] > a[property] ? 1 : 0;
    return result * sortOrder;
  };
}
