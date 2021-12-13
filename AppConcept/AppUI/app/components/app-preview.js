import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',

  convertImage: function(){
    console.log(this.get('app.logo'));
  }.on('init')

  // showImage() {
  //   // let image = new Image();
  //   // image.src = this.get('logo');
  //   console.log(this.get('logo'));
  //   // document.getElementById('uploadedimage').append(image);
  // }
});