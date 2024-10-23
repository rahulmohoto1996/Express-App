/* #version=0.0.0-0#2 rm 2024-10-23T19:17:52 AA461FC1819B3AF1 */
/* #version=0.0.0-0#1 rm 2024-10-22T19:29:10 50C2C9F5F7ADCA73 */
module.exports = {

    mockData: {
        events : 
            [
                {
                    id: 1,
                    name: 'Charity Ball',
                    category: 'Fundraising',
                    description: 'Spend an elegant night of dinner and dancing with us as we raise money for our new rescue farm.',
                    featuredImage: 'https://placekitten.com/500/500',
                    images: [
                    'https://placekitten.com/500/500',
                    'https://placekitten.com/500/500',
                    'https://placekitten.com/500/500',
                    ],
                    location: '1234 Fancy Ave',
                    date: '12-25-2019',
                    time: '11:30'
                },
                {
                    id: 2,
                    name: 'Rescue Center Goods Drive',
                    category: 'Adoptions',
                    description: 'Come to our donation drive to help us replenish our stock of pet food, toys, bedding, etc. We will have live bands, games, food trucks, and much more.',
                    featuredImage: 'https://placekitten.com/500/500',
                    images: [
                    'https://placekitten.com/500/500'
                    ],
                    location: '1234 Dog Alley',
                    date: '11-21-2019',
                    time: '12:00'
                }
            ]
    }
    
    // getAllEvents: function() {
    //     app.get('/events', (req, res) => {
    //         res.send(events);
    //     });
    // },
    
    // getSelectedEventsFromId: function() {
    //     app.get('/events/:id', (req, res) => {
    //         const id = Number(req.params.id);
    //         const event = events.find(event => event.id === id);
    //         res.send(event);
    //     });
    // }
    
    }