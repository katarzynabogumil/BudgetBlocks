// @ts-nocheck 
'use strict';

import { Prisma } from '@prisma/client';
import * as dotenv from "dotenv";
dotenv.config();

// type mockdata = {
//   users: Prisma.UserCreateManyInput[],
//   projects: Prisma.ProjectCreateManyInput[],
//   categories: Prisma.ExpCategoryCreateManyInput[],
//   expenses: Prisma.ExpenseCreateManyInput[],
//   comments: Prisma.CommentCreateManyInput[],
// }

// type ExpCreate = Prisma.ExpenseCreateInput & {
//   category: {
//     category: string,
//     orderId: number
//   }
// }

export const mockdata = {
  users: [
    {
      id: 1,
      sub: process.env.MOCK_USER_1 || '',
      firstName: 'katarzyna@example.com',
      lastName: 'katarzyna@example.com',
      nickname: 'katarzyna',
      email: 'katarzyna@example.com'
    },
    {
      id: 2,
      sub: process.env.MOCK_USER_2 || '',
      firstName: 'bart@example.com',
      lastName: 'bart@example.com',
      nickname: 'bart',
      email: 'bart@example.com'
    },
    {
      id: 3,
      sub: process.env.MOCK_USER_3 || '',
      firstName: 'anna@example.com',
      lastName: 'anna@example.com',
      nickname: 'anna',
      email: 'anna@example.com'
    }
  ],
  projects: [
    {
      id: 1,
      name: "Summer Vacation",
      type: "trip",
      budget: 5000,
      currency: "EUR",
      dateFrom: "2023-07-15T00:00:00.000Z",
      dateTo: "2023-07-30T00:00:00.000Z",
      area: null,
      location: null,
      noOfGuests: 2,
      occasion: null,
      origin: "Berlin",
      destination: "Barcelona",
      description: "Enjoy a summer vacation - sightseeing, sunbathing and sangria.",
      owners: {
        id: 1
      }
    },
    {
      id: 2,
      name: "Living room redecoration",
      type: "construction",
      budget: 1500,
      currency: "EUR",
      dateFrom: "2023-08-01T00:00:00.000Z",
      dateTo: "2023-08-05T00:00:00.000Z",
      area: 30,
      location: 'Berlin',
      noOfGuests: null,
      occasion: null,
      origin: null,
      destination: null,
      description: 'Redecoration of the living room to brighten it up.',
      owners:
      {
        id: 1
      }
    }
  ],
  categories: [
    {
      data: {
        category: 'Flights',
        orderId: 1,
        project: {
          connect: {
            id: 1,
          }
        }
      },
    },
    {
      data: {
        category: 'Accommodation',
        orderId: 2,
        project: {
          connect: {
            id: 1,
          }
        }
      },
    },
    {
      data: {
        category: 'Transportation',
        orderId: 3,
        project: {
          connect: {
            id: 1,
          }
        }
      },
    },
    {
      data: {
        category: 'Activities',
        orderId: 4,
        project: {
          connect: {
            id: 1,
          }
        }
      },
    },
    {
      data: {
        category: 'Sofa',
        orderId: 1,
        project: {
          connect: {
            id: 2,
          }
        }
      },
    },
    {
      data: {
        category: 'Carpet',
        orderId: 2,
        project: {
          connect: {
            id: 2,
          }
        }
      },
    },
    {
      data: {
        category: 'Art',
        orderId: 3,
        project: {
          connect: {
            id: 2,
          }
        }
      },
    },
    {
      data: {
        category: 'Lamp',
        orderId: 4,
        project: {
          connect: {
            id: 2,
          }
        }
      },
    },
  ],
  expenses: [
    [
      1,
      {
        name: "Morning Flights",
        cost: 724,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departure time: 6:00 AM. I'm too old for that.",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {
        name: "Most Convenient Flights",
        cost: 927,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departureat 10:00 AM",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {

        name: "Evening Flights",
        cost: 525,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departure at 10:00 PM, not the worst",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {
        name: "W Hotel",
        cost: 6663,
        currency: "EUR",
        link: "https://www.booking.com/hotel/es/w-barcelona.de.html?checkin=2023-07-15;checkout=2023-07-30;dest_id=49226",
        photo: "https://insiderei.com/wp-content/uploads/2017/06/sundeck.jpg",
        notes: "A bit of a splurge",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Hotel Rec",
        cost: 2547,
        currency: "EUR",
        link: "https://www.booking.com/hotel/es/rec-barcelona.de.html?aid=304142&checkin=2023-07-15;checkout=2023-07-30;dest_id=49226",
        photo: "https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,h_600,q_auto,w_600//itemimages/89/11/8911532_v5.jpeg",
        notes: "Charming hotel in the city center",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Airbnb Rental",
        cost: 3597,
        currency: "EUR",
        link: "https://www.airbnb.com/rooms/plus/22739717?adults=2&check_in=2023-07-15&check_out=2023-07-30",
        photo: "https://a0.muscache.com/im/pictures/572f640c-dd3b-4e95-8893-caf715e42789.jpg",
        notes: "Apartment as a not so budget option",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Car Rental",
        cost: 250,
        currency: "EUR",
        link: null,
        photo: "https://cdn2.rcstatic.com/images/car_images/web/opel/corsa_4_doors_lrg.jpg",
        notes: "Opel corsa at Firefly",
        category: { category: 'Transportation', orderId: 3 }
      },
    ],
    [
      1,
      {
        name: "Public Transportation",
        cost: 40,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Explore the city like a local",
        category: { category: 'Transportation', orderId: 3 }
      },
    ],
    [
      1,
      {
        name: "City Tour",
        cost: 60,
        currency: "EUR",
        link: null,
        photo: "https://res.cloudinary.com/https-www-isango-com/image/upload/f_auto/t_m_Prod/v7682/europe/spain/barcelona/23280.jpg",
        notes: "Guided tour of the main attractions",
        category: { category: 'Activities', orderId: 4 }
      },
    ],
    [
      1,
      {
        name: "Sagrada familia entrance",
        cost: 52,
        currency: "EUR",
        link: null,
        photo: "https://www.embeddedmetadata.org/supportgallery-img/images/img-2011-12-06T134452-170.jpg",
        notes: "Explore the city's rich cultural heritage",
        category: { category: 'Activities', orderId: 4 }
      },
    ],
    [
      1,
      {
        name: "Fine Dining at Abac",
        cost: 590,
        currency: "EUR",
        link: null,
        photo: "https://whythisplace.com/wp-content/uploads/2022/08/abac-barcelona-interiors-1024x576.jpeg",
        notes: "+140 EUR each for wine pairing",
        category: { category: 'Activities', orderId: 5 }
      },
    ],
    [
      2,
      {
        name: "fancy sofa",
        cost: 1599,
        currency: "EUR",
        link: null,
        photo: "https://www.leyform.com/_seating-f-office-waiting-congress-areas/gallery/lobby-reception-and-waiting-room-sofas-armchairs-img-01.jpg",
        notes: null,
        category: { category: 'Sofa', orderId: 1 }
      },
    ],
    [
      2,
      {
        name: "cosy sofa",
        cost: 999,
        currency: "EUR",
        link: null,
        photo: "https://bielefelder-werkstaetten.jab.de/medias/sys_master/images/images/h01/hc0/8883597541406/img-bw-brand-configurator-furniture-inspiration-sofa-2-Kopie.jpg",
        notes: null,
        category: { category: 'Sofa', orderId: 1 }
      },
    ],
    [
      2,
      {
        name: "ikea sofa",
        cost: 829,
        currency: "EUR",
        link: null,
        photo: "https://www.ikea.com/de/de/images/products/aepplaryd-3er-sofa-lejde-grau-schwarz__1023709_pe833227_s5.jpg",
        notes: null,
        category: { category: 'Sofa', orderId: 1 }
      },
    ],
    [
      2,
      {
        name: "Cheap carpet",
        cost: 29,
        currency: "EUR",
        link: null,
        photo: "https://www.ikea.com/de/de/images/products/tiphede-teppich-flach-gewebt-natur-schwarz__0772105_pe755880_s5.jpg?f=m",
        notes: null,
        category: { category: 'Carpet', orderId: 2 }
      },
    ],
    [
      2,
      {
        name: "Ikea carpet",
        cost: 99,
        currency: "EUR",
        link: null,
        photo: "https://www.ikea.com/de/de/images/products/vedbaek-teppich-kurzflor-hellgrau__1080044_pe857843_s5.jpg?f=xs",
        notes: null,
        category: { category: 'Carpet', orderId: 2 }
      },
    ],
    [
      2,
      {
        name: "Colorful picture",
        cost: 89,
        currency: "EUR",
        link: null,
        photo: "https://www.bhg.com/thmb/jtizEvo0XmvalwcWw3ba1XG-zk4=/1244x0/filters:no_upscale():strip_icc()/colorful-painting-mantelpiece-d61bdfea-0bc87b9d67054574813b79e479b15fdc.jpg",
        notes: null,
        category: { category: 'Art', orderId: 3 }
      },
    ],
    [
      2,
      {
        name: "Abstract picture",
        cost: 129,
        currency: "EUR",
        link: null,
        photo: "https://www.bhg.com/thmb/HE4h7i2P3GRm6j95-mzj0MV6yGQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/large-watercolor-swirl-art-entryway-bench-6fa89b7f-7af183672bec44f897fa8627c871686e.jpg",
        notes: null,
        category: { category: 'Art', orderId: 3 }
      },
    ],
    [
      2,
      {
        name: "Artwork",
        cost: 239,
        currency: "EUR",
        link: null,
        photo: "https://m.media-amazon.com/images/I/81nANRbTjSL.jpg",
        notes: null,
        category: { category: 'Art', orderId: 3 }
      },
    ],
    [
      2,
      {
        name: "Lamp",
        cost: 69,
        currency: "EUR",
        link: null,
        photo: "https://www.ikea.com/de/de/images/products/lauters-standleuchte-esche-weiss__0663863_pe712536_s5.jpg",
        notes: null,
        category: { category: 'Lamp', orderId: 4 }
      },
    ],
    [
      2,
      {
        name: "Curved lamp",
        cost: 159,
        currency: "EUR",
        link: null,
        photo: "https://lw-cdn.com/images/6705C2AFBADA/k_35bd8c8139847aca002047e42cc2fdbe;w_535;h_535;q_70/gebogene-stehleuchte-jonera-schwarz-und-golden.webp",
        notes: null,
        category: { category: 'Lamp', orderId: 4 }
      },
    ],
  ],
  comments: [

  ],
  upvotes: [

  ],
  downvotes: [

  ]
}

