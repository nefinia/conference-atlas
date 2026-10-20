# Organiser kit

The app only helps people who find it. At the first conference about four in ten visits came through the organisers' email, and most of the rest were people coming back by themselves. Whatever you send in the week before the event does most of the work.

## The email paragraph

Put it near the top of the last email before the event. Replace the words in brackets.

> The programme is also online. Open [address] in any browser, on your phone or your laptop, with nothing to install. You can star the talks you want to see, write notes, and you will see when two of them overlap. It works without a connection once opened, needs no account and uses no cookies.

## The slide for the opening session

One slide, shown while people sit down. The QR code and the address, nothing else.

> The programme, in your browser
> [QR code]
> [address]

The opening speaker needs ten seconds for it. A good line to say: "Open the link and star the talks you want to see. Tonight you can see which ones overlap."

## The QR code

    npm install qrcode
    node tools/make-qr.mjs https://your-address/ qr.svg

The SVG scales to any size, so it works on a badge, a slide or a poster. Use `qr.png` as the file name for a picture. Scan it with a phone before printing. `assets/qr-demo.svg` shows the result.

## The first morning

People decide on the first morning whether the app is part of their day. At the first conference use fell after Wednesday.

- Have the first announcement ready before the doors open. It can be the plan for the day or the place for lunch.
- Put the QR code on the registration desk and on the badge.
- Ask the chair of the first session to mention the link.
- Open the app yourself at 08:30 on a phone with mobile data, and check that the Now tab shows today.
- If you use the server, check the organiser page by posting a test announcement and removing it.

## During the event

- Announcements and moved talks go through `admin.html`. Without a server you download `live.json` and upload it to your website. With the server you press one button. Phones update within five minutes, or when someone opens the app.
- Say the changes out loud as well. Not everyone has opened the app that day.
- Social features reach a small group. At the first conference sync, the assistant and the board each reached 6 to 8 percent of the people present. Keep them as a bonus.

## After the event

Feedback arrives when you ask for it. The last screen of the app has a one-tap rating. Add one line to your thank-you email:

> If the programme app was useful, a tap on the stars on its last screen tells us.

The app turns into a thank-you screen after the last day. Announcements and the rating stay there.

Delete what you no longer need. The board posts are removed on the date you set in `retentionUntil`.
