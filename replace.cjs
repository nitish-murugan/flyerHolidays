const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/HomePage.jsx',
  'src/pages/GalleryPage.jsx',
  'src/pages/PackageDetailPage.jsx',
  'src/pages/AboutPage.jsx',
  'src/pages/ReviewsPage.jsx',
  'src/pages/admin/AdminPackages.jsx',
  'src/pages/admin/AdminReviews.jsx',
  'src/pages/admin/AdminHero.jsx',
  'src/pages/admin/AdminStates.jsx',
  'src/pages/admin/AdminGallery.jsx',
  'src/pages/admin/AdminSettings.jsx',
  'src/components/PackageCard.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/http:\/\/localhost:5000/g, 'https://flyer-holidays-backend.vercel.app');
  fs.writeFileSync(fullPath, content);
  console.log('Updated ' + file);
});
