import * as dotenv from 'dotenv';
dotenv.config();

export const mockdata = {
  users: [
    {
      sub: process.env.MOCK_USER_1_SUB || '',
      firstName: process.env.MOCK_USER_1_FNAME || '',
      lastName: process.env.MOCK_USER_1_LNAME || '',
      nickname: process.env.MOCK_USER_1_NICKNAME || '',
      email: process.env.MOCK_USER_1_EMAIL || '',
      projects: {
        create: [
          {
            name: 'Summer Vacation',
            type: 'trip',
            budget: 5000,
            currency: 'EUR',
            dateFrom: '2023-07-15T00:00:00.000Z',
            dateTo: '2023-07-30T00:00:00.000Z',
            area: null,
            location: null,
            noOfGuests: 2,
            occasion: null,
            origin: 'Berlin',
            destination: 'Barcelona',
            description: 'Enjoy a summer vacation - sightseeing, sunbathing and sangria.',
            categories: {
              create: [
                {
                  category: 'Flights',
                  orderId: 1,
                  expenses: {
                    create: [
                      {
                        name: 'Morning Flights',
                        cost: 724,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
                        notes: `Departure time: 6:00 AM. I'm too old for that.`,
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Most Convenient Flights',
                        cost: 927,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
                        notes: 'Departureat 10:00 AM',
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Evening Flights',
                        cost: 525,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
                        notes: 'Departure at 10:00 PM, not the worst',
                        project: { connect: { id: 1 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Accommodation',
                  orderId: 2,
                  expenses: {
                    create: [
                      {
                        name: 'W Hotel',
                        cost: 6663,
                        currency: 'EUR',
                        link: 'https://www.booking.com/hotel/es/w-barcelona.de.html?checkin=2023-07-15;checkout=2023-07-30;dest_id=49226',
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/hotelw_tul1cw.jpg',
                        notes: 'A bit of a splurge',
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Hotel Rec',
                        cost: 2547,
                        currency: 'EUR',
                        link: 'https://www.booking.com/hotel/es/rec-barcelona.de.html?aid=304142&checkin=2023-07-15;checkout=2023-07-30;dest_id=49226',
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/hotelrec_tfhfmp.jpg',
                        notes: 'Charming hotel in the city center',
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Airbnb Rental',
                        cost: 3597,
                        currency: 'EUR',
                        link: 'https://www.airbnb.com/rooms/plus/22739717?adults=2&check_in=2023-07-15&check_out=2023-07-30',
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/airbnb_bjmass.jpg',
                        notes: 'Apartment as a not so budget option',
                        project: { connect: { id: 1 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Transportation',
                  orderId: 3,
                  expenses: {
                    create: [
                      {
                        name: 'Car Rental',
                        cost: 250,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/car_egvybk.jpg',
                        notes: 'Opel corsa at Firefly',
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Public Transportation',
                        cost: 40,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/publictransport_sgm4jj.jpg',
                        notes: 'Explore the city like a local',
                        project: { connect: { id: 1 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Activities',
                  orderId: 4,
                  optional: true,
                  expenses: {
                    create: [
                      {
                        name: 'City Tour',
                        cost: 60,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/tour_lhpnj6.jpg',
                        notes: 'Guided tour of the main attractions',
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Sagrada familia entrance',
                        cost: 52,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/sagrada_fbwc9l.jpg',
                        notes: `Explore the city's rich cultural heritage`,
                        project: { connect: { id: 1 } }
                      },
                      {
                        name: 'Fine Dining at Abac',
                        cost: 590,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/abac_tthbbf.jpg',
                        notes: '+140 EUR each for wine pairing',
                        project: { connect: { id: 1 } }
                      },
                    ]
                  }
                },
              ]
            }
          },
          {
            name: 'Living room redecoration',
            type: 'construction',
            budget: 1500,
            currency: 'EUR',
            dateFrom: '2023-08-01T00:00:00.000Z',
            dateTo: '2023-08-05T00:00:00.000Z',
            area: 30,
            location: 'Berlin',
            noOfGuests: null,
            occasion: null,
            origin: null,
            destination: null,
            description: 'Redecoration of the living room to brighten it up.',
            categories: {
              create: [
                {
                  category: 'Sofa',
                  orderId: 1,
                  expenses: {
                    create: [
                      {
                        name: 'fancy sofa',
                        cost: 1599,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/fancysofa_fwoinf.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'cosy sofa',
                        cost: 999,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/cosysofa_k255jc.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'ikea sofa',
                        cost: 829,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/ikeasofa_ar7jxc.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Carpet',
                  orderId: 2,
                  expenses: {
                    create: [
                      {
                        name: 'Cheap carpet',
                        cost: 29,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/cheapcarpet_aiqxga.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'Ikea carpet',
                        cost: 99,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/ikeacarpet_wzlqri.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Art',
                  orderId: 3,
                  optional: true,
                  expenses: {
                    create: [
                      {
                        name: 'Colorful picture',
                        cost: 89,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/colorfulart_vunxzs.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'Abstract picture',
                        cost: 129,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/abstractart_tlcs71.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'Artwork',
                        cost: 239,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854050/art_watk3x.jpg',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                    ]
                  }
                },
                {
                  category: 'Lamp',
                  orderId: 4,
                  optional: true,
                  expenses: {
                    create: [
                      {
                        name: 'Lamp',
                        cost: 69,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854046/lamp_jqqctu.avif',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                      {
                        name: 'Curved lamp',
                        cost: 159,
                        currency: 'EUR',
                        link: null,
                        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687854048/curvedlamp_bzoz2a.webp',
                        notes: null,
                        project: { connect: { id: 2 } }
                      },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}