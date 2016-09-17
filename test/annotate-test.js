var tape = require("tape"),
    annotate = require("../");


tape("annotate is a thing", function(test) {
  test.ok(annotate);
  test.end();
});
