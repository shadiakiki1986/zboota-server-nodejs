'use strict';
var DdbManagerWrapper = require('app/DdbManagerWrapper');

/*
DdbManagerWrapper.getNotSilent(
  [{"a":"B","n":"123"}],
  { fail: function(err) {
      console.error('Error: '+err);
    },
    succeed: function(res) {
      console.log(res);
    }
  });
*/

DdbManagerWrapper.getNotSilent(
  [
    { "a": "B", "n": "123", "l": "test" },
    { "a": "B", "n": "123123", "l": "test", "hp": "11-20", "y": "2010", "t": "Private cars" },
		{ "a": "M", "n": "239296", "l": "Kangoo", "hp": "11-20", "y": "2005", "t": "Private transport vehicles" },
		{ "a": "M", "n": "213822", "l": "Express", "hp": "11-20", "y": "2001 and before", "t": "Private transport vehicles" },
		{ "a": "M", "n": "190895", "l": "Silver", "hp": "11-20", "y": "2001 and before", "t": "Private transport vehicles" },
		{ "a": "G", "n": "220683", "l": "Envoy", "hp": "31-40", "y": "2005", "t": "Private cars" },
		{ "a": "G", "n": "387175", "l": "Avanza", "hp": "11-20", "y": "2008", "t": "Private cars" },
		{ "a": "G", "n": "479060", "l": "Suzuki" },
		{ "a": "G", "n": "300317", "l": "test" },
		{ "a": "J", "n": "100", "l": "test judge", "hp": "11-20", "y": "2015", "t": "Private cars" },
		{ "a": "G", "n": "666", "l": "666" },
		{ "a": "G", "n": "218844", "l": "Jaguar", "hp": "21-30", "y": "2001 and before", "t": "Private cars" },
		{ "a": "B", "n": "537005", "l": "Lancer", "hp": "11-20", "y": "2013", "t": "Private cars" },
		{ "a": "B", "n": "134431", "l": "test", "hp": "1 - 10", "y": "2015", "t": "Private cars" },
/*		{ "a": "B", "n": "510812", "l": "test" },
		{ "a": "B", "n": "188450", "l": "test", "hp": "1 - 10", "y": "2012", "t": "Private cars" },
		{ "a": "B", "n": "138288", "l": "test" },
		{ "a": "B", "n": "444", "l": "test" },
		{ "a": "B", "n": "123456", "l": "test", "hp": "11-20", "y": "2014", "t": "Private cars" },
		{ "a": "B", "n": "555", "l": "test" },
		{ "a": "N", "n": "9999", "l": "test", "hp": "11-20", "y": "2012", "t": "Private cars" },
		{ "a": "B", "n": "12312333", "l": "test", "hp": "11-20", "y": "2010", "t": "Private cars" },
		{ "a": "B", "n": "393015", "l": "cherokee" },
		{ "a": "G", "n": "98989898", "l": "test", "hp": "1 - 10", "y": "2014", "t": "Private cars" },
		{ "a": "B", "n": "888", "l": "888", "hp": "1 - 10", "y": "2013", "t": "Private cars" },
		{ "a": "B", "n": "1234", "l": "test" }
*/  ],
  { fail: function(err) {
      console.error('Error: '+err);
    },
    succeed: function(res) {
      console.log(res);
    }
  });

