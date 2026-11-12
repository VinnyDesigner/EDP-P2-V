const fs = require('fs');

['public/edp-en.html', 'public/puture-en.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f, 'length:', content.length);
  console.log(f, 'has contact-dialog:', content.includes('class="contact-dialog'));
  console.log(f, 'has is-contact-open in JS:', content.includes('is-contact-open'));
  console.log(f, 'has contact-dialog__close:', content.includes('contact-dialog__close'));
  console.log(f, 'has contact-dialog__panel:', content.includes('contact-dialog__panel'));
});

