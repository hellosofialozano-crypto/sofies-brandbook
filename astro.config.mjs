import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://YOUR_USERNAME.github.io",
  base: "/sofies-brandbook",

  integrations: [
    starlight({
      title: "SOFI'ES Collection",

      description:
        "Software, edited. The source of truth for the SOFI'ES ecosystem.",

      sidebar: [
        {
          label: "Philosophy",
          items: [
            {
              label: "Manifesto",
              link: "/philosophy/manifesto/"
            },
            {
              label: "Principles",
              link: "/philosophy/principles/"
            }
          ]
        },

        {
          label: "Maison Design System",
          items: [
            {
              label: "Overview",
              link: "/maison/overview/"
            },
            {
              label: "Design Tokens",
              link: "/maison/tokens/"
            },
            {
              label: "Typography",
              link: "/maison/typography/"
            }
          ]
        },

        {
          label: "Product",
          items: [
            {
              label: "Experience Principles",
              link: "/product/experience-principles/"
            }
          ]
        },

        {
          label: "Engineering",
          items: [
            {
              label: "Standards",
              link: "/engineering/standards/"
            }
          ]
        }
      ]
    })
  ]
});
