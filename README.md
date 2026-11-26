# ir3d3um site

A free website for GitHub Pages. Nothing here needs a paid licence.

## What is in the folder
- index.html: the public site
- admin.html: your private admin page (add, edit, reorder, delete artworks)
- accounts.js, firebase-config.js, site.json: visitor accounts, their settings, and the sale banner
- policies.html: shipping, returns, customs, copyright and privacy for buyers worldwide
- currency.js: shows an approximate price in the visitor's currency
- artworks.json: the list of artworks and their details
- images/: artwork images (small gallery copy and a capped larger copy of each)
- inbox/: drop new photos here and the bot publishes them
- .github/workflows/inbox.yml and tools/process_inbox.py: the inbox bot

## 1. Put it online
1. Upload everything in this folder to your GitHub repository, including the hidden .github folder.
2. Repository Settings > Pages > Deploy from a branch > main > / (root). Save.
3. Settings > Actions > General > Workflow permissions > Read and write. Save.
4. Your site is at https://YOUR-USERNAME.github.io/YOUR-REPO/

## 2. Add artwork by dropping files in the inbox (the bot)
1. Put a photo in the inbox folder, for example cactus.jpg.
2. Next to it, add a text file with the same name, cactus.txt. See inbox/EXAMPLE-template.txt. Lines: Title, Size, Medium, Price, Status, Description.
3. Commit. Within a minute or two the bot shrinks the photo, adds the artwork to the gallery and clears the inbox.
You can do this from the GitHub app or website on your phone (Add file > Upload files).

## 3. Add or edit artwork with the admin page
Open /admin.html on your site and sign in with your GitHub username, repository name and your access token (Contents: read and write for this repository only). Keep the token private.

## 4. Visitor tracking (free)
1. Sign up at goatcounter.com (free for personal sites) and choose a site code.
2. In index.html, replace YOUR-CODE in the goatcounter line with your code.
3. In GoatCounter, Settings > Site > allow adding events from the page is on by default.
You will see visitors, pages and countries, plus events named opened, enquire and wallview for each artwork. That tells you which pieces get attention. Time spent on a piece is not measured; opens and enquiries are the best signal.

## 5. Enquiry form (free, Formspree)
1. Sign up at formspree.io (free plan), create a new form, and copy its address, which looks like https://formspree.io/f/abcd1234.
2. Open site.js and replace https://formspree.io/f/YOUR-FORM-ID at the top with your address. Commit.
The same form appears in the Get in touch section and in the pop-up on each drawing. Your Gmail address is never shown on the site. Messages go to Formspree, which forwards them to the Gmail address you sign up with. Until you connect Formspree, the form shows a message asking visitors to use Instagram instead.
Visitors choose: ask a question, buy, or ask about something similar. Country and phone or address only appear if they choose to buy.
Sold pieces show a Sold label, and the button changes to Ask about something similar.

## 6. Protection, honestly
- Right-click, drag and long-press saving are blocked on artwork, and printing is disabled.
- The gallery shows small, lower-quality copies and the enlarged view is capped, so the full-resolution original is never published.
- A faint ir3d3um mark runs across every drawing, and a copyright notice is shown.
- Nothing can stop a screenshot. The watermark and lower resolution are what protect you.
- Keep your full-resolution originals off the repository.

## 7. See it on a wall and Try it in your room
Each drawing has a "See it on a wall" button. It shows the artwork framed on a wall, with a few wall and frame options. It is a preview only.

Try it in your room lets a visitor choose a photo of their own wall and drag your drawing onto it. Their photo stays on their device and is never uploaded.

## 8. Visitor accounts (free Firebase plan)
Visitors can create an account to save favourite drawings (tap the heart), see their enquiries, and opt in to sale and event alerts. Until you finish this setup the site runs in demo mode, where accounts live only on the visitor's own device.
1. Go to console.firebase.google.com, Add project, name it ir3d3um, and switch Google Analytics off. Stay on the free Spark plan.
2. Build > Authentication > Get started. Turn on Email/Password and Google.
3. Authentication > Settings > Authorized domains > add YOUR-USERNAME.github.io.
4. Build > Firestore Database > Create database. Choose production mode and a location near you (for example Mumbai).
5. Firestore > Rules. Replace everything with the rules below and Publish:

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{uid} {
          allow read, write: if request.auth != null && request.auth.uid == uid;
          match /enquiries/{id} {
            allow read, create: if request.auth != null && request.auth.uid == uid;
          }
        }
      }
    }

6. Project settings (gear icon) > Your apps > Web (the </> icon). Register the app, then copy the config values into firebase-config.js (apiKey, authDomain, projectId, appId). These values are not secret.
7. Authentication > Templates > Email address verification: you can edit the wording, and keep the sender name as ir3d3um. Verification emails are sent for free.
8. Commit. The Sign in button in the header then works for real.

## 9. Sale and event alerts
- Banner: in admin.html, type a message in "Sale or event banner" and save. It appears at the top of the site for everyone.
- Email list: in Firebase > Firestore > users, each person who opted in has alerts set to true and their email stored. Copy those emails and send your announcement yourself (put them in BCC), or paste them into a free email tool. The free Firebase plan cannot send emails automatically.
- Enquiries in a visitor's account show as Sent. You reply by email, and status updates are not tracked automatically.

## 10. Prices in other currencies
Prices stay fixed in Indian rupees. The site shows an approximate amount beside each price in the visitor's currency, using a free daily exchange rate (open.er-api.com), and a small currency selector in the top bar lets visitors change it. Write each price in rupees in the admin page or inbox text file, for example "Rs 12,000" or "12000". Pieces marked "Price on request" or Sold show no conversion.

## 11. Policies page
policies.html holds the delivery (10 to 15 days), returns (damage only, 48 hours to report, 10 to 15 days to return, refund or store credit after the piece is back and checked), no exchanges, customs and duties, commissions, copyright and privacy text. Please read it through, check it matches how you want to work, and have a lawyer or your payment provider look it over before you start selling abroad. Consumer rules differ by country.

## 12. Profiles and the 5% welcome discount (once per account)
Each account has a profile (name, phone, country), saved drawings and enquiries. After sign-up a verification email is sent. When the visitor clicks the link, their Account page shows their own personal code, like WELCOME5-K7P2M. The code is different for every account.
- **Once only.** When someone orders with the code, open Firebase > Firestore > users > their record and add a field codeUsed set to true (boolean). Their Account page then shows the discount as used, and the code is no longer sent with their enquiries.
- **Seeing it in your inbox.** Every enquiry from a signed-in visitor includes their account email, whether it is verified (yes or no) and their code if it is still unused. If the verified answer is no, or there is no code, do not give the discount.
- **Genuine email.** Verification proves the email address is real. A second genuine email counts as a separate account, which is fine for this scheme.
- **Rules.** Visitors can read their own record but cannot set codeUsed on it. To make sure of that, replace the users rule in section 8 with this one:

    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid && !("codeUsed" in request.resource.data);
      allow update: if request.auth != null && request.auth.uid == uid && !request.resource.data.diff(resource.data).affectedKeys().hasAny(["codeUsed"]);
      match /enquiries/{id} {
        allow read, create: if request.auth != null && request.auth.uid == uid;
      }
    }

- Phone and country are stored under the visitor's own record and only they can read or change them.
