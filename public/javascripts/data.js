
function printHelloU(){
    document.getElementById("ext1").innerHTML = "welcome Hello-Universe (executed printHelloU)";  
  }
  
  function printHelloGalaxy(name){
    document.getElementById("ext2").innerHTML = name +" : welcome Hello-Galaxy (executed printHelloGalaxy)";  
  }
  
  function selfRun() {
    document.write("<p> Welcome selfrun !</p>");
  }
  
  window.onload = selfRun();
  
  
  var arrayWithElements = new Array();
  
  function clickListener(e) 
  {   
      var clickedElement=(window.event)
                          ? window.event.srcElement
                          : e.target,
          tags=document.getElementsByTagName(clickedElement.tagName);
  
      for(var i=0;i<tags.length;++i)
      {
        if(tags[i]==clickedElement)
        {
          arrayWithElements.push({tag:clickedElement.tagName,index:i}); 
          console.log(arrayWithElements);
        }    
      }
  }
  
  //document.onclick = clickListener;
  
  