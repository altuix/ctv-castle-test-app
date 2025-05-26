const placeholders = {
  "16:9": "https://www.techvise.in/images/placeholder.png",
  "9:16": "https://www.techvise.in/images/placeholder.png",
  "1:1": "https://www.techvise.in/images/placeholder.png",
  "4:3": "https://www.techvise.in/images/placeholder.png",
  "21:9": "https://www.techvise.in/images/placeholder.png",
};

const getRandomRatio = () => {
  const ratios = Object.keys(placeholders);
  return ratios[Math.floor(Math.random() * ratios.length)];
};

const generateSimilarContent = (count = 6) => {
  return Array.from({ length: count }, (_, index) => {
    const ratio = getRandomRatio();
    return {
      id: `similar-${index}`,
      title: `Similar Content ${index + 1}`,
      thumbnail: placeholders[ratio],
      description: `Description text for similar content ${index + 1}.`,
      ratio: ratio
    };
  });
};

export const mockData = {
  menu: [
    { title: "Home", thumbnail: placeholders["16:9"], sectionId: "home" },
    { title: "Movies", thumbnail: placeholders["16:9"], sectionId: "movies" },
    { title: "Settings", thumbnail: placeholders["16:9"], sectionId: "settings" },
  ],
  moviesRails: [
    {
      title: "Popular Movies",
      railType: "16:9",
      items: [
        {
          title: "The Avengers",
          thumbnail: placeholders["16:9"],
          description: "Earth's mightiest heroes must come together to save the world.",
          ratio: "16:9",
        },
        {
          title: "Inception",
          thumbnail: placeholders["16:9"],
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          ratio: "16:9",
        },
        {
          title: "The Dark Knight",
          thumbnail: placeholders["16:9"],
          description: "Batman fights against the Joker's anarchy in Gotham City.",
          ratio: "16:9",
        },
        {
          title: "Interstellar",
          thumbnail: placeholders["16:9"],
          description: "A team of explorers travel through a wormhole in space.",
          ratio: "16:9",
        },
        {
          title: "The Matrix",
          thumbnail: placeholders["16:9"],
          description: "A computer hacker learns about the true nature of reality.",
          ratio: "16:9",
        }
      ]
    }
  ],
  similarContent: generateSimilarContent(6),
  homeRails: Array.from({ length: 20 }, (_, railIndex) => {
    // Define a fixed ratio type for each rail
    // First 5 rails with 16:9, next 5 rails with 1:1, next 5 rails with 9:16, last 5 rails with mixed
    let railRatio;
    if (railIndex < 5) {
      railRatio = "16:9"; // 16:9 ratio for first 5 rails
    } else if (railIndex < 10) {
      railRatio = "1:1"; // 1:1 ratio for next 5 rails
    } else if (railIndex < 15) {
      railRatio = "9:16"; // 9:16 ratio for next 5 rails
    } else {
      railRatio = "4:3"; // 4:3 ratio for last 5 rails
    }

    return {
      title: `Movies ${railIndex + 1}`,
      railType: railRatio, // Rail'in genel tipi
      items: Array.from({ length: 10 }, (_, itemIndex) => {
        // You can assign different ratios to each item for mixed ratio rails
        const itemRatio = railIndex >= 15 ? getRandomRatio() : railRatio;

        return {
          title: `Movie ${railIndex * 10 + itemIndex + 1}`,
          thumbnail: placeholders[itemRatio],
          description: `Description for Movie ${railIndex * 10 + itemIndex + 1}`,
          ratio: itemRatio, // Item's ratio
        };
      }),
    };
  }),

};