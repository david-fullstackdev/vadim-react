const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./dist'));
// Non-Logged In Pages
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

// start app
const PORT = process.env.PORT || 9000;
app.listen(PORT, function() {
  console.log(`The production app is listening on port ${PORT}!`);
});
