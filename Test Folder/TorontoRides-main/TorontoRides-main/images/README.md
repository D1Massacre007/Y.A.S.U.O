Place your car images here using the exact filenames below so the site can load them automatically.

Expected filenames (exact):
- tesla-model3.jpg
- bmw-x5.jpg
- honda-civic.jpg
- ford-mustang.jpg
- toyota-rav4.jpg
- mercedes-c-class.jpg
- audi-a4.jpg
- jeep-wrangler.jpg
- porsche-911.jpg
- chevrolet-tahoe.jpg
- toyota-camry.jpg
- mazda-cx5.jpg
- volkswagen-jetta.jpg
- lexus-rx.jpg
- hyundai-elantra.jpg
- chevrolet-corvette.jpg
- subaru-outback.jpg
- kia-sportage.jpg
- dodge-charger.jpg
- ford-f150.jpg
- nissan-leaf.jpg

Quick PowerShell move example (adjust source filename):

cd "c:\Users\Alessandro Warwar\OneDrive - York University\Year 4 Classes\Fall Term\ITEC 3230\TorontoRiders.ca"
# Move one file from Downloads to images folder and rename it to the expected filename
Move-Item "$env:USERPROFILE\Downloads\my-attachment-file.jpg" .\images\tesla-model3.jpg

# Or move multiple, repeating the command per file. You can also drag & drop in File Explorer.
