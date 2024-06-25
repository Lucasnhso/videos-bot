const projectId = "OW7Aw18zi6sFpA";
    const projectUrl = `${cutlabsUrl}/project/${projectId}`
    await page.waitForNavigation()
    await page.goto(projectUrl);

    
    await page.waitForSelector('video')
    const body = await page.evaluate(() => {
      const data = [];

      const elementVideos = document.querySelectorAll('video');
      const elementImages = document.querySelectorAll('img');
      const elementMinutes = document.querySelectorAll('.mantine-dx3820');
      const elementScores = document.querySelectorAll('.mantine-dx3820');
      const elementDescription = document.querySelectorAll('.mantine-dx3820');
      
      for(let i = 0; i < elementVideos.length; i++) {
        data.push({
          video: elementVideos[i].src,
          image: elementImages[i].srcset,
          minutes: elementMinutes[i].innerHTML
        })
      }
      // for (const item of elementVideos) {
      //   videos.push(item.src)
      // }
      // for (const item of elementImages) {
      //   if(item.srcset){
      //     images.push(item.srcset)
      //   }
      // }
      // for (const item of elementMinutes) {
      //   minutes.push(item.innerHTML)
      // }
      
      return data;
    });
    console.log(body);