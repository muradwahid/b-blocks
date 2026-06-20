const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the admin page
    await page.goto('http://localhost:8881/wp-admin/admin.php?page=b-blocks', {
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/admin-page.png' });
    
    // Check for errors in console
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    
    // Get page content
    const content = await page.content();
    const hasBlankDiv = content.includes("id='bBlocksDashboard'");
    const bodyText = await page.textContent('body');
    
    console.log('Page loaded successfully');
    console.log('Has bBlocksDashboard div:', hasBlankDiv);
    console.log('Body text length:', bodyText ? bodyText.length : 0);
    console.log('Body text (first 200 chars):', bodyText ? bodyText.substring(0, 200) : 'empty');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
