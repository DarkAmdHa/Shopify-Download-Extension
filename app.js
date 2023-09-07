class ShopifyThemeDownload {
    constructor(){
        this.isEditor = false;
        this.loading = false;
        this.mainBtn = document.querySelector('.mainBtn')
        this.spinner = document.querySelector('.lds-dual-ring')
        
        this.init()
        this.attachEventListeners()
    }

    setLoading(state){
        if(state){
            this.loading = true;
            this.spinner.classList.add('loading')
        }else{
            this.loading = false;
            this.spinner.classList.remove('loading') 
        }
    }

    setUpButton (){
        this.mainBtn.disabled = !this.isEditor;
        if(!this.isEditor && !document.querySelector('.refreshBtn')){
            const refreshButton = document.createElement('button')
            refreshButton.innerText ='Refresh'
            refreshButton.classList.add('refreshBtn', 'mainBtn')
            refreshButton.addEventListener('click', e=>{
                e.preventDefault();
                this.checkForEditor();
            })
            this.mainBtn.style.display = 'none';
            this.mainBtn.parentElement.appendChild(refreshButton)
        }else if(this.isEditor){
            if(document.querySelector('.refreshBtn'))
                document.querySelector('.refreshBtn').remove();  
            this.mainBtn.style.display = '';
        }
    }

    checkForEditor(){
        this.setLoading(true)
        setTimeout(() => {
            this.setLoading(false)
            if(document.querySelector('main[aria-label="Online store editor"]'))
                this.isEditor = true;
            else
                this.isEditor = false;
            this.setUpButton()
        }, 2000);
    }

    init(){
        this.checkForEditor()
    }
    saveItem(content,name){
        const blob = new Blob([content], { type: 'text/html' });
        
        // Create a temporary URL representing the Blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a link element for downloading
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = name; // Change the filename as needed
        downloadLink.textContent = 'Download File'; // Optional: Set link text
        
        // Append the link to the document
        document.body.appendChild(downloadLink);
        
        // Programmatically trigger a click on the link to initiate download
        downloadLink.click();
        
        // Clean up: Revoke the temporary URL
        URL.revokeObjectURL(blobUrl);
    }

    async downloadTemplates(){
        const templates = document.querySelectorAll('#folder-layout #Collapsible-folder-layout ol > li');

        for (let i = 0; i < templates.length; i++) {
            const el = templates[i];
            const btn = el.querySelector('button');
            const id = el.id;

            if (!id.includes('add-new')) {
                btn.click();
                const itemIdContainer = btn.closest('li[data-diffy-attribute]').getAttribute('data-diffy-attribute');
                const itemId = itemIdContainer.split('fileName-layout/')[1];
                const panelId = 'panel-tab-layout/' + itemId;
                let loadedPanel = document.getElementById(panelId);
                await new Promise(resolve => {
                    const checkLoaded = setInterval(() => {
                        loadedPanel = document.getElementById(panelId);
                        if (loadedPanel && loadedPanel.querySelector('.japyj') && loadedPanel.querySelector('.japyj').innerText !== '') {
                            clearInterval(checkLoaded);
                            saveItem(loadedPanel.querySelector('.japyj [role="textbox"]').innerText,itemId)
                            resolve();
                        }
                    }, 500);
                });
            }
        }
    }

    attachEventListeners(){
        console.log(chrome.windows)
        console.log(document.querySelector('body'))
        console.log(document.querySelector('#folder-layout'))
        this.mainBtn.addEventListener('click', e=>{
            if(this.isEditor){
                console.log('YAY')
            }
        })
    }
}


const spf = new ShopifyThemeDownload()



















// //The following code already does it. All that's left is to integrate it into the extension:

// const saveItem = (content, name, folderName, imgURL) => {
//     if(imgURL){
//         // Create a link element for downloading
//         const downloadLink = document.createElement('a');
//         downloadLink.href = imgURL;

//         downloadLink.download = folderName + '----' + name; // Set the full path

    

//         // Append the link to the document
//         document.body.appendChild(downloadLink);
    
//         // Programmatically trigger a click on the link to initiate download
//         downloadLink.click();
    
//         // Remove the download link from the document
//         document.body.removeChild(downloadLink);
//     }else{
//         // Create a Blob from the content
//         const blob = new Blob([content], { type: 'text/html' });
    
//         // Create a temporary URL representing the Blob
//         const blobUrl = URL.createObjectURL(blob);
    
//         // Create a link element for downloading
//         const downloadLink = document.createElement('a');
//         downloadLink.href = blobUrl;

//         downloadLink.download = folderName + '----' + name; // Set the full path

    

//         // Append the link to the document
//         document.body.appendChild(downloadLink);
    
//         // Programmatically trigger a click on the link to initiate download
//         downloadLink.click();
    
//         // Clean up: Revoke the temporary URL
//         URL.revokeObjectURL(blobUrl);
    
//         // Remove the download link from the document
//         document.body.removeChild(downloadLink);
//     }
// };



// async function closeAllFolders(){
//     const allFolders = document.querySelectorAll('[data-diffy-attribute="search"] + ol > li');
//     for (let j = 0; j < allFolders.length; j++) {
//         const element = allFolders[j];
//         const folderName = element.id.split('folder-')[1];
//         const templates = document.querySelectorAll('#folder-' + folderName + ' #Collapsible-folder-' + folderName + ' ol > li');
//         if(templates.length){
//             element.querySelector('button').click();
//             await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the panel to load
//         }
//     }

// }

// async function processTemplates() {
//     const allFolders = document.querySelectorAll('[data-diffy-attribute="search"] + ol > li');
//     await closeAllFolders();
//     for (let j = 5; j < allFolders.length; j++) {
//         const element = allFolders[j];
//         const folderName = element.id.split('folder-')[1];

//         element.querySelector('button').click();
//         await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the panel to load

//         const templates = document.querySelectorAll('#folder-' + folderName + ' #Collapsible-folder-' + folderName + ' ol > li');

//         for (let i = 0; i < templates.length; i++) {
//             const el = templates[i];
//             const but = el.querySelector('button');
//             const id = el.id;

//             if (!id.includes('add-new')) {
//                 but.click();

//                 const itemIdContainer = but.closest('li[data-diffy-attribute]').getAttribute('data-diffy-attribute');
//                 const splitString = 'fileName-' + folderName + '/';
//                 const itemId = itemIdContainer.split(splitString)[1];
//                 const panelId = 'panel-tab-' + folderName + '/' + itemId;

//                 await new Promise(resolve => {
//                     const checkLoaded = setInterval(() => {
//                         const loadedPanel = document.getElementById(panelId);

//                         if (loadedPanel && ((loadedPanel.querySelector('.japyj [role="textbox"]') && loadedPanel.querySelector('.japyj [role="textbox"]').innerText !== '') || (loadedPanel.querySelector('.japyj .UGfIO')))) {
//                             clearInterval(checkLoaded);
//                             if(loadedPanel.querySelector('.japyj .UGfIO')){
//                                 //saveItem('', itemId,folderName,loadedPanel.querySelector('.japyj .UGfIO').src);
                                
//                             }else{
//                                 saveItem(loadedPanel.querySelector('.japyj [role="textbox"]').innerText, itemId,folderName);
//                             }
                                
//                             //Close the tab:
//                             const tabId = 'tab-' + folderName + '/' + itemId;
//                             document.getElementById(tabId).nextElementSibling.click()
//                             resolve(); // Resolve the promise to continue the loop
//                         }
//                     }, 500);
//                 });
//             }
//         }
//     }
// }

// processTemplates();