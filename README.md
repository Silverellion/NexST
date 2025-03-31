1. master-container-red (CSS Styling) is not necessary, it's only purpose is to set the background to red. You don't need to call it.

2. When adding products to filter, remember to assign its page:

```html

 <div class = "product-grid active"  id = "page-1">

```

the page aren't automatically assigned by default for ease of future customization.

3. HTML Summarization  

    3.1. TEMPLATEs 
    - 3.1.1. TEMPLATE1: Header (With nav-links) + Footer.  
    - 3.1.2. TEMPLATE2: Header (With animated search bar) + Footer.  

    3.2. Filters
    - 3.2.1. Filter1: PC specs, Pre-built PCs, laptops...  
    - 3.2.2. Filter2: Screen filter.  
    - 3.2.3. Filter3: PC specs, Pre-built PCs like Filter1 but includes a product images filter (GPU, CPU, RAM...).  
    - 3.2.4. Filter4: Keyboard and Mouses, includes a Color filter in the sidebar.
