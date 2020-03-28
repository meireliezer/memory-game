export function iOS() {

    var iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ];
  

    if (!!navigator.platform) {
      return !!iDevices.find( device => device === navigator.platform)      
    }
  
    return false;
  }