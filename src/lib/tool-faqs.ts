/**
 * FAQ data for all 40 tools
 * Each tool has 5 SEO-optimized Q&A pairs
 */

interface FAQ {
  question: string;
  answer: string;
}

const TOOL_FAQS: Record<string, FAQ[]> = {
  "monetization-checker": [
    {
      question: "How does the YouTube Monetization Checker work?",
      answer: "Our monetization checker analyzes a YouTube channel's public data including subscriber count, video count, watch hours, and other signals that indicate whether a channel has joined the YouTube Partner Program (YPP).",
    },
    {
      question: "How many subscribers do you need to monetize on YouTube?",
      answer: "To be eligible for the YouTube Partner Program, you need at least 1,000 subscribers and 4,000 watch hours in the past 12 months, OR 1,000 subscribers and 10 million Shorts views in 90 days.",
    },
    {
      question: "Can I check monetization on any YouTube channel?",
      answer: "Yes, you can check any public YouTube channel by pasting the channel URL, @username, or Channel ID into our tool.",
    },
    {
      question: "Is this monetization checker 100% accurate?",
      answer: "Our tool uses available public signals to estimate monetization status. YouTube does not provide an official public API endpoint for monetization status, so results are estimates based on known YPP eligibility criteria.",
    },
    {
      question: "Does the monetization checker require login?",
      answer: "No, our tool is completely free and requires no account, login, or YouTube API key from your side. Simply paste a channel URL and get results instantly.",
    },
  ],

  "channel-analytics": [
    {
      question: "What analytics data can I see for any YouTube channel?",
      answer: "You can view total subscribers, total views, video count, channel creation date, description, country, custom URL, and estimated average views per video.",
    },
    {
      question: "Is there a limit on how many channels I can analyze?",
      answer: "No, you can analyze as many channels as you like. Our tool uses the YouTube Data API v3 which provides generous daily quotas.",
    },
    {
      question: "Can I see competitor channel analytics?",
      answer: "Yes! You can analyze any public YouTube channel, making this tool perfect for competitor research and niche analysis.",
    },
    {
      question: "Why are some subscriber counts shown as hidden?",
      answer: "YouTube allows channels with under 1,000 subscribers to hide their subscriber count. When a channel hides their count, we display 'Hidden' rather than an inaccurate estimate.",
    },
    {
      question: "Can I export the analytics data?",
      answer: "Yes, you can copy individual stats or use the export button to download data as CSV for further analysis in spreadsheets.",
    },
  ],

  "thumbnail-downloader": [
    {
      question: "What thumbnail resolutions can I download?",
      answer: "You can download YouTube thumbnails in all available resolutions: Default (120×90), Medium (320×180), High (480×360), Standard (640×480), and Max Resolution / 4K (1280×720 or higher).",
    },
    {
      question: "Is it legal to download YouTube thumbnails?",
      answer: "YouTube thumbnails are publicly accessible and can be downloaded for personal, educational, or reference purposes. For commercial use, you should obtain permission from the copyright holder.",
    },
    {
      question: "Can I download thumbnails from YouTube Shorts?",
      answer: "Yes! Our thumbnail downloader works with all YouTube content types including regular videos, Shorts, and live streams.",
    },
    {
      question: "Why is the Max Resolution thumbnail not available for some videos?",
      answer: "Not all videos have a max-resolution (1280×720) thumbnail. Older videos or some Shorts may only have default or standard quality thumbnails available.",
    },
    {
      question: "Can I bulk download thumbnails from multiple videos?",
      answer: "Currently our tool supports one video at a time. Use the Playlist Viewer tool to see all videos in a playlist, then download thumbnails individually.",
    },
  ],

  "ai-title-generator": [
    {
      question: "How does the AI YouTube Title Generator work?",
      answer: "Our AI title generator uses Google Gemini to analyze your topic or keyword and generate 10 highly engaging, SEO-optimized YouTube titles. It follows proven patterns of viral content including curiosity gaps, numbers, and emotional triggers.",
    },
    {
      question: "How many titles does the AI generate?",
      answer: "The tool generates 10 unique titles per request, each with a different style — how-to, listicle, question-based, shock value, and more.",
    },
    {
      question: "Are the AI-generated titles optimized for YouTube SEO?",
      answer: "Yes! Each title is crafted to be 50-70 characters long (optimal for YouTube), include relevant keywords, and maximize click-through rates based on proven YouTube growth patterns.",
    },
    {
      question: "Can I customize the AI titles for my niche?",
      answer: "Yes, include specific keywords, your target audience, or channel style in your prompt for more targeted results. The more specific you are, the better the titles.",
    },
    {
      question: "Is the AI title generator free?",
      answer: "Yes, completely free! It uses the Google Gemini 1.5 Flash model which has a generous free tier. No signup required.",
    },
  ],

  "earnings-calculator": [
    {
      question: "How accurate is the YouTube earnings calculator?",
      answer: "Our calculator provides estimates based on industry-average RPM (Revenue Per Mille) rates of $1-$10 depending on niche and geography. Actual earnings vary significantly based on audience location, niche, watch time, and advertiser demand.",
    },
    {
      question: "What is a good RPM on YouTube?",
      answer: "RPM varies widely by niche. Finance and business channels typically earn $10-50 RPM, tech $5-15 RPM, gaming $2-5 RPM, and entertainment $1-4 RPM. The average across all niches is approximately $3-5.",
    },
    {
      question: "How do YouTube creators actually get paid?",
      answer: "YouTube creators earn money through AdSense (ad revenue), Channel Memberships, Super Chats, Super Thanks, merchandise, and the YouTube Shopping affiliate program.",
    },
    {
      question: "When does YouTube pay its creators?",
      answer: "YouTube pays AdSense earnings monthly, around the 21st of each month, once your balance reaches $100. Payments are made via bank transfer, check, or other methods depending on your country.",
    },
    {
      question: "Can I estimate earnings for another YouTuber's channel?",
      answer: "Yes! Paste any public YouTube channel URL and our calculator will estimate their daily, monthly, and yearly earnings based on their view count and average RPM for their apparent niche.",
    },
  ],

  "seo-score-checker": [
    {
      question: "How is the YouTube SEO score calculated?",
      answer: "Our SEO score analyzes title length and keyword density, description quality and length, number of tags, thumbnail presence, category selection, captions availability, and engagement metrics to produce a score out of 100.",
    },
    {
      question: "What is a good YouTube SEO score?",
      answer: "A score of 80-100 is excellent, 60-79 is good, 40-59 is average, and below 40 needs improvement. Most successful videos score above 70.",
    },
    {
      question: "How can I improve my YouTube SEO score?",
      answer: "Add 15-30 relevant tags, write a 200+ word description with keywords, use a title between 50-70 characters, add closed captions, create custom thumbnails, and fill in all available metadata fields.",
    },
    {
      question: "Does video SEO score affect ranking?",
      answer: "While YouTube's algorithm considers many factors including watch time, click-through rate, and engagement, proper SEO optimization significantly helps videos appear in search results and suggested videos.",
    },
    {
      question: "Can I check SEO score for any YouTube video?",
      answer: "Yes, paste any public YouTube video URL to get a full SEO analysis with specific actionable recommendations for improvement.",
    },
  ],

  "transcript-downloader": [
    {
      question: "What formats can I download transcripts in?",
      answer: "You can download transcripts as plain TXT, SRT (SubRip subtitle format), or copy the raw text to clipboard. JSON format is also available for developers.",
    },
    {
      question: "Does every YouTube video have a transcript?",
      answer: "Not all videos have transcripts. Videos with auto-generated captions or manually uploaded subtitles will have transcripts. Videos without any captions will show 'No transcript available'.",
    },
    {
      question: "Are the transcripts auto-generated or human-created?",
      answer: "YouTube automatically generates captions for most videos using speech recognition. Creators can also upload manually created transcripts. Both types are available through our tool.",
    },
    {
      question: "Can I download transcripts in different languages?",
      answer: "Yes, if a video has translated captions available, you can select the language. Our tool lists all available caption tracks for the video.",
    },
    {
      question: "Is downloading YouTube transcripts legal?",
      answer: "Downloading transcripts for personal use, research, or accessibility purposes is generally acceptable. For commercial use or republication, check the video's license and copyright terms.",
    },
  ],

  "tags-extractor": [
    {
      question: "Can I see hidden tags on YouTube videos?",
      answer: "Yes! YouTube video tags are hidden from viewers in the page HTML but accessible via the YouTube API. Our tool extracts all tags that creators have added to their videos.",
    },
    {
      question: "Why would I want to extract YouTube video tags?",
      answer: "Extracting tags from popular videos in your niche helps you understand their SEO strategy, discover keywords you might be missing, and improve your own video's discoverability.",
    },
    {
      question: "How many tags can a YouTube video have?",
      answer: "YouTube allows up to 500 characters of total tag content. This typically means 15-30 tags depending on tag length. Our tool shows all tags and the total character count used.",
    },
    {
      question: "Are YouTube tags still important for SEO?",
      answer: "While tags have become less important compared to titles and descriptions, they still help YouTube understand your video's topic and can help with discovery for misspellings and variations of your keywords.",
    },
    {
      question: "Can I copy all tags at once?",
      answer: "Yes! Click the 'Copy All' button to copy all extracted tags as a comma-separated list. You can then paste them directly into your YouTube Studio tags field.",
    },
  ],

  "channel-id-finder": [
    {
      question: "What is a YouTube Channel ID?",
      answer: "A YouTube Channel ID is a unique identifier starting with 'UC' followed by 22 characters (e.g., UCxxxxxxxxxxxxxxxxxxxxxx). It's used in API calls and direct links and never changes, unlike custom URLs.",
    },
    {
      question: "How do I find a YouTube Channel ID?",
      answer: "Paste any YouTube channel URL, @username, or custom URL into our tool and we'll instantly extract and display the permanent Channel ID.",
    },
    {
      question: "Why do I need a Channel ID?",
      answer: "Channel IDs are needed for YouTube API calls, embedding playlists, creating direct channel links, and integrations with third-party tools like social media schedulers.",
    },
    {
      question: "What is the difference between a Channel ID and a Custom URL?",
      answer: "A Channel ID (UCxxxx) is permanent and assigned by YouTube. A Custom URL (@username) can be changed by the creator. Always use Channel IDs in code and applications for reliability.",
    },
    {
      question: "Does the Channel ID finder work for @username handles?",
      answer: "Yes! Just paste the @username (e.g., @MrBeast) and our tool will instantly resolve it to the permanent Channel ID.",
    },
  ],

  "url-parser": [
    {
      question: "What YouTube URL formats does the parser support?",
      answer: "Our parser supports all YouTube URL formats: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/@handle, youtube.com/channel/UC..., youtube.com/c/, youtube.com/user/, youtube.com/playlist?list=, and bare @username formats.",
    },
    {
      question: "What information does the URL parser extract?",
      answer: "It extracts the URL type (video/channel/playlist/shorts), Video ID, Channel ID, Username/Handle, Playlist ID, and other components present in the URL.",
    },
    {
      question: "Does the parser work with YouTube mobile URLs?",
      answer: "Yes, m.youtube.com URLs are fully supported along with youtu.be short URLs.",
    },
    {
      question: "What can I do with extracted Video or Channel IDs?",
      answer: "IDs can be used in YouTube API calls, embedded players, analytics tools, or any YouTube integration. They're more reliable than URLs which can change.",
    },
    {
      question: "Does the URL parser work offline?",
      answer: "The URL parsing itself is done client-side and works without an API call. However, to verify that a video or channel exists, it needs to call the YouTube API.",
    },
  ],

  "embed-generator": [
    {
      question: "What embed options does the YouTube Embed Generator support?",
      answer: "Our embed generator supports autoplay, mute, start time, end time, loop, controls visibility, fullscreen, related videos, and privacy-enhanced mode (youtube-nocookie.com).",
    },
    {
      question: "What is YouTube's privacy-enhanced embed mode?",
      answer: "When using youtube-nocookie.com instead of youtube.com, YouTube doesn't set cookies on your visitors unless they click play. This is better for GDPR compliance.",
    },
    {
      question: "Can I embed YouTube playlists?",
      answer: "Yes! Paste a playlist URL to generate embed code that shows all playlist videos with playlist navigation controls.",
    },
    {
      question: "How do I make a YouTube embed responsive?",
      answer: "Our generator includes responsive wrapper CSS code that makes the embed maintain its 16:9 aspect ratio on all screen sizes.",
    },
    {
      question: "Is there a way to embed YouTube Shorts?",
      answer: "Yes, Shorts can be embedded using the standard embed code. Our tool auto-detects Shorts URLs and generates appropriate embed code with portrait orientation suggestions.",
    },
  ],

  "ai-description-generator": [
    {
      question: "What does the AI YouTube Description Generator include?",
      answer: "The generated description includes a keyword-rich opening paragraph, bullet points of what viewers will learn, timestamps, a call-to-action (subscribe/like/comment), social links placeholders, and relevant hashtags.",
    },
    {
      question: "How long are the AI-generated descriptions?",
      answer: "Our AI generates descriptions between 300-500 words, which is the ideal length for YouTube SEO. Descriptions should be long enough to include keywords but not keyword-stuffed.",
    },
    {
      question: "Can I customize the AI description for my channel style?",
      answer: "Yes! Include your channel name, target audience, specific keywords, and preferred tone in the prompt for more personalized descriptions.",
    },
    {
      question: "Are AI descriptions good for YouTube SEO?",
      answer: "Yes! Our AI structures descriptions following YouTube SEO best practices: primary keyword in the first 100 characters, natural keyword distribution, timestamps for watch time, and CTAs for engagement.",
    },
    {
      question: "How many descriptions can I generate for free?",
      answer: "Our tool is completely free with no limits. It uses Google Gemini's free tier which allows generous daily usage.",
    },
  ],

  "comment-sentiment": [
    {
      question: "How does YouTube comment sentiment analysis work?",
      answer: "Our tool fetches the top comments from a YouTube video using the YouTube API, then sends them to Google Gemini AI which classifies each comment as positive, negative, or neutral and identifies key themes.",
    },
    {
      question: "How many comments does the sentiment analyzer process?",
      answer: "We analyze up to 100 of the top comments by relevance. This sample is representative of the overall audience sentiment.",
    },
    {
      question: "What information does the sentiment report include?",
      answer: "The report includes overall sentiment label (positive/negative/neutral/mixed), percentage breakdown, a summary paragraph, top positive and negative themes, and the most mentioned keywords.",
    },
    {
      question: "Can sentiment analysis help my YouTube strategy?",
      answer: "Absolutely! Understanding audience sentiment helps you identify what content resonates, what to avoid, common viewer complaints, and opportunities for follow-up videos.",
    },
    {
      question: "Does this work for my own channel's videos?",
      answer: "Yes! It works for any public YouTube video, including your own. It's a great way to get an objective view of how your audience feels about your content.",
    },
  ],

  "watch-time-calculator": [
    {
      question: "How is watch time calculated for a YouTube playlist?",
      answer: "Our tool fetches all videos in a playlist, retrieves the duration of each video, and sums them up to give you total watch time in hours, minutes, and seconds.",
    },
    {
      question: "How much watch time do I need for YouTube monetization?",
      answer: "You need 4,000 valid public watch hours in the past 12 months to qualify for the YouTube Partner Program, along with 1,000 subscribers.",
    },
    {
      question: "Can I calculate watch time for an entire channel?",
      answer: "Yes, paste a channel URL and our tool will calculate the total watch time across all public videos uploaded to that channel.",
    },
    {
      question: "What if a video has been deleted from a playlist?",
      answer: "Deleted videos from playlists are automatically excluded from the calculation since they're no longer publicly available.",
    },
    {
      question: "Can I see watch time breakdown per video?",
      answer: "Yes, the detailed view shows each video's individual duration alongside the running total, helping you identify your longest and shortest videos.",
    },
  ],

  "content-idea-generator": [
    {
      question: "How does the AI Content Idea Generator work?",
      answer: "Enter your YouTube niche or topic, and our AI (powered by Google Gemini) analyzes trending content patterns to generate 12 unique, high-potential video ideas tailored to your channel.",
    },
    {
      question: "What information does each content idea include?",
      answer: "Each idea includes a catchy title, opening hook, video format (tutorial, vlog, review, etc.), estimated view potential, and difficulty rating (Easy/Medium/Hard).",
    },
    {
      question: "How do I come up with YouTube video ideas when I'm stuck?",
      answer: "Use our AI Content Idea Generator! Simply describe your channel niche and target audience. The AI considers trending topics, evergreen content, and audience psychology to suggest ideas that will perform well.",
    },
    {
      question: "Can the ideas be customized for my channel size?",
      answer: "Yes, mention your current subscriber count in the prompt (e.g., 'small channel with 1000 subs'). The AI will tailor ideas appropriate for your audience size and expected reach.",
    },
    {
      question: "How often should I use the content idea generator?",
      answer: "Use it whenever you need inspiration — weekly brainstorming sessions work great! The AI generates fresh ideas each time, so you'll never get the same results twice.",
    },
  ],

  "ai-seo-optimizer": [
    {
      question: "What does the AI YouTube SEO Optimizer do?",
      answer: "Paste a YouTube video URL and our AI analyzes the title, description, and tags, then generates optimized versions of all three with specific improvement notes and a new SEO score.",
    },
    {
      question: "How much can AI improve my YouTube SEO?",
      answer: "Most videos see significant improvements in click-through rate after optimizing titles, and better discoverability after adding properly researched tags. The specific impact depends on your niche competition.",
    },
    {
      question: "Will changing my title affect existing views?",
      answer: "No, changing your title won't reset views. However, it may temporarily affect your ranking as YouTube re-indexes the video. This is normal and rankings typically improve within a week.",
    },
    {
      question: "How do I apply the AI SEO suggestions?",
      answer: "Copy the optimized title, description, and tags from our tool, then go to YouTube Studio → Content → select your video → Details → paste the optimized content.",
    },
    {
      question: "Does the AI consider my channel's existing keywords?",
      answer: "If you paste a video URL, the AI analyzes your current metadata including existing keywords. For best results, also describe your channel niche in the input.",
    },
  ],

  "ai-hashtag-generator": [
    {
      question: "How many hashtags should I use on YouTube videos?",
      answer: "YouTube recommends using 3-5 hashtags per video. Using more than 15 hashtags causes YouTube to ignore all of them. Our tool generates 20 so you can pick the best 3-5 for your video.",
    },
    {
      question: "Where do YouTube hashtags appear?",
      answer: "YouTube hashtags appear above the video title on the watch page and in the description. Clicking a hashtag shows a feed of other videos using the same hashtag.",
    },
    {
      question: "What's the difference between hashtags and tags on YouTube?",
      answer: "Hashtags (#) appear publicly and are clickable, shown above your title (limited to 3) and in the description. Tags are hidden keywords that only appear in metadata and help YouTube categorize your content.",
    },
    {
      question: "Should I use trending hashtags even if they're not related?",
      answer: "No! Using unrelated trending hashtags violates YouTube's policies and can lead to your video being removed from search results. Always use relevant hashtags.",
    },
    {
      question: "Can hashtags boost video views?",
      answer: "Yes! Relevant hashtags help your video appear in hashtag-based searches and feeds. Niche hashtags are often more effective than overly broad ones because competition is lower.",
    },
  ],

  "ai-tags-generator": [
    {
      question: "How does the AI YouTube Tags Generator work?",
      answer: "Enter your video topic, and our AI generates 30+ SEO-optimized tags including primary keywords, long-tail variations, and related terms that YouTube's algorithm uses to categorize and recommend your video.",
    },
    {
      question: "What makes a good YouTube tag?",
      answer: "Good tags include: your exact video title, variations of your main keyword, related topics, your channel name, and long-tail phrases (3-5 words). Mix broad and specific tags.",
    },
    {
      question: "How long can YouTube tags be?",
      answer: "Individual tags can be up to 30 characters, and your total tags field has a 500-character limit. Our generated tags are all optimized to fit within these limits.",
    },
    {
      question: "Do YouTube tags still matter in 2025?",
      answer: "Yes, but they're less powerful than titles and descriptions. Tags help most with: ranking for exact match searches, correcting misspellings of your keywords, and helping YouTube understand your content category.",
    },
    {
      question: "Can I copy all 30 generated tags at once?",
      answer: "Yes! Click 'Copy All Tags' to copy them as a comma-separated list. Paste directly into YouTube Studio's tags field — YouTube will automatically separate them.",
    },
  ],

  "profile-picture-downloader": [
    {
      question: "What resolution are YouTube profile pictures?",
      answer: "YouTube profile pictures are available in multiple sizes: 28×28 (thumbnail), 88×88 (standard), and 240×240 (high resolution). Our tool provides all available sizes for download.",
    },
    {
      question: "Can I download a YouTube channel's profile picture in HD?",
      answer: "Yes! We extract the highest available resolution (up to 240×240 pixels) from the YouTube channel data. Some channels may have higher resolution images available.",
    },
    {
      question: "Is it legal to download YouTube profile pictures?",
      answer: "Profile pictures can be downloaded for personal and educational use. Using them commercially or claiming them as your own is a copyright violation.",
    },
    {
      question: "Can I download profile pictures for private channels?",
      answer: "No, our tool only works with public YouTube channels. Private or terminated channels cannot be accessed.",
    },
    {
      question: "Does this work for @username handles?",
      answer: "Yes! Paste @username, channel URL, or Channel ID to download the profile picture. All input formats are supported.",
    },
  ],

  "banner-downloader": [
    {
      question: "What is a YouTube channel banner?",
      answer: "A YouTube channel banner (also called channel art) is the large image displayed at the top of a YouTube channel page. The recommended size is 2560×1440 pixels.",
    },
    {
      question: "Can I download YouTube channel banners in full resolution?",
      answer: "Yes! Our tool downloads the channel banner at the highest available resolution directly from YouTube's CDN, typically at 2560×1440 or the size the creator uploaded.",
    },
    {
      question: "Why don't some channels have banners?",
      answer: "Not all channel owners upload a channel banner. New channels or minimalist creators may not have set one up. In this case, our tool will indicate no banner is available.",
    },
    {
      question: "Can I use a downloaded YouTube banner as inspiration for my own?",
      answer: "Yes, for creative inspiration. However, you should never copy and use another creator's banner as your own — always create original artwork.",
    },
    {
      question: "What format are YouTube banners downloaded in?",
      answer: "Channel banners are downloaded as JPEG or PNG files depending on the original format uploaded by the creator.",
    },
  ],
};

// Generate generic FAQs for tools not explicitly listed
function getGenericFAQs(toolName: string): FAQ[] {
  return [
    {
      question: `Do I need an API key to use ${toolName}?`,
      answer: `No! ${toolName} works immediately out of the box with zero API keys or logins required. It uses our built-in creator engine. Connecting your personal free Gemini or YouTube API key is 100% optional for dedicated live quotas.`,
    },
    {
      question: `Is the ${toolName} free to use?`,
      answer: `Yes! The ${toolName} is completely free to use. No account, subscription, or credit card required.`,
    },
    {
      question: `How accurate is the ${toolName}?`,
      answer: `Our ${toolName} uses the official YouTube Data API v3 for all data fetching, ensuring the most accurate and up-to-date information available.`,
    },
    {
      question: `Does the ${toolName} work on mobile?`,
      answer: `Yes! Our tool is fully responsive and works perfectly on smartphones, tablets, and desktops.`,
    },
    {
      question: `How fast does the ${toolName} work?`,
      answer: `Results are typically returned in 1-3 seconds. We cache results for 1 hour to ensure fast repeat lookups.`,
    },
    {
      question: `Is there a rate limit on the ${toolName}?`,
      answer: `For fair usage, we recommend not exceeding 50 requests per hour. Our tool is intended for research and analysis, not bulk automated scraping.`,
    },
  ];
}

export function getToolFAQs(toolId: string): FAQ[] {
  return TOOL_FAQS[toolId] || getGenericFAQs(toolId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
}
