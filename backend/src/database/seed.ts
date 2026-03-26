import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository('User');
    const propertyRepository = AppDataSource.getRepository('Property');
    const favouriteRepository = AppDataSource.getRepository('Favourite');

    // Clear existing data
    await AppDataSource.query('DELETE FROM favourite');
    await AppDataSource.query('DELETE FROM property');
    await AppDataSource.query('DELETE FROM "user"');

    // Seed users with JSONB profile and settings
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    const users = await userRepository.save([
      {
        email: 'john@example.com',
        password: hashedPassword,
        profile: {
          name: 'John Doe',
          role: 'buyer',
          phone: '+1-555-0101',
          bio: 'Looking for a modern apartment in the city center',
          preferences: {
            propertyTypes: ['apartment', 'condo'],
            priceRange: { min: 300000, max: 800000 },
            locations: ['Downtown', 'City Center'],
            notifications: true,
          },
        },
        settings: {
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          smsNotifications: false,
          timezone: 'America/New_York',
        },
      },
      {
        email: 'jane@example.com',
        password: hashedPassword,
        profile: {
          name: 'Jane Smith',
          role: 'buyer',
          phone: '+1-555-0102',
          bio: 'Searching for a family home with a garden',
          preferences: {
            propertyTypes: ['house', 'villa'],
            priceRange: { min: 500000, max: 1500000 },
            locations: ['Suburban Area', 'Green Valley'],
            notifications: true,
          },
        },
        settings: {
          language: 'en',
          theme: 'dark',
          emailNotifications: true,
          smsNotifications: true,
          timezone: 'America/Los_Angeles',
        },
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        profile: {
          name: 'Admin User',
          role: 'admin',
          phone: '+1-555-0000',
          bio: 'System Administrator',
        },
        settings: {
          language: 'en',
          theme: 'dark',
          emailNotifications: true,
          smsNotifications: true,
          timezone: 'UTC',
        },
      },
    ]);

    console.log('Users seeded:', users.length);

    // Seed properties with JSONB data and metadata
    const properties = await propertyRepository.save([
      {
        data: {
          title: 'Modern Downtown Apartment',
          description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
          price: 450000,
          location: 'Downtown, City Center',
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          type: 'apartment',
          features: ['Hardwood Floors', 'Central AC', 'Dishwasher', 'Walk-in Closet'],
          amenities: ['Gym', 'Pool', 'Concierge', '24/7 Security'],
          yearBuilt: 2020,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 245, featured: true, verified: true, tags: ['luxury', 'downtown', 'modern'] },
      },
      {
        data: {
          title: 'Luxury Villa with Pool',
          description: 'Spacious 4-bedroom villa with private pool and garden in exclusive neighborhood.',
          price: 1200000,
          location: 'Westside, Premium District',
          bedrooms: 4,
          bathrooms: 3,
          area: 3500,
          imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          type: 'house',
          features: ['Private Pool', 'Garden', 'Home Office', 'Smart Home', 'Wine Cellar'],
          amenities: ['Gated Community', 'Tennis Court', 'Clubhouse'],
          yearBuilt: 2019,
          parking: 3,
          status: 'available',
        },
        metadata: { views: 512, featured: true, verified: true, tags: ['luxury', 'pool', 'villa', 'premium'] },
      },
      {
        data: {
          title: 'Cozy Studio Near University',
          description: 'Perfect for students or young professionals. Fully furnished studio apartment.',
          price: 180000,
          location: 'University District',
          bedrooms: 1,
          bathrooms: 1,
          area: 450,
          imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          type: 'apartment',
          features: ['Furnished', 'High-Speed Internet', 'Kitchenette'],
          amenities: ['Laundry', 'Bike Storage', 'Study Room'],
          yearBuilt: 2018,
          parking: 0,
          status: 'available',
        },
        metadata: { views: 189, featured: false, verified: true, tags: ['affordable', 'student', 'furnished'] },
      },
      {
        data: {
          title: 'Family Home with Garden',
          description: 'Charming 3-bedroom house with large backyard, perfect for families.',
          price: 650000,
          location: 'Suburban Area, Green Valley',
          bedrooms: 3,
          bathrooms: 2,
          area: 2200,
          imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          type: 'house',
          features: ['Large Backyard', 'Fireplace', 'Updated Kitchen', 'Basement'],
          amenities: ['Playground', 'Community Park', 'Good Schools'],
          yearBuilt: 2015,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 334, featured: true, verified: true, tags: ['family', 'garden', 'suburban'] },
      },
      {
        data: {
          title: 'Penthouse with Panoramic Views',
          description: 'Exclusive penthouse on the top floor with 360-degree city views.',
          price: 2500000,
          location: 'Financial District',
          bedrooms: 3,
          bathrooms: 3,
          area: 2800,
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          type: 'apartment',
          features: ['Panoramic Views', 'Private Elevator', 'Chef Kitchen', 'Spa Bathroom', 'Terrace'],
          amenities: ['Valet Parking', 'Rooftop Lounge', 'Wine Storage', 'Doorman'],
          yearBuilt: 2021,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 678, featured: true, verified: true, tags: ['luxury', 'penthouse', 'views', 'exclusive'] },
      },
      {
        data: {
          title: 'Beachfront Condo',
          description: 'Wake up to ocean views every day in this beautiful beachfront property.',
          price: 890000,
          location: 'Coastal Area, Beach Road',
          bedrooms: 2,
          bathrooms: 2,
          area: 1500,
          imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          type: 'apartment',
          features: ['Ocean View', 'Balcony', 'Open Floor Plan', 'Hurricane Windows'],
          amenities: ['Beach Access', 'Pool', 'BBQ Area', 'Surfboard Storage'],
          yearBuilt: 2017,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 445, featured: true, verified: true, tags: ['beach', 'ocean', 'vacation', 'coastal'] },
      },
      {
        data: {
          title: 'Mountain Retreat Cabin',
          description: 'Escape to the mountains in this cozy log cabin with stunning peak views.',
          price: 550000,
          location: 'Pine Ridge, Mountain View',
          bedrooms: 2,
          bathrooms: 1,
          area: 1100,
          imageUrl: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
          type: 'house',
          features: ['Fireplace', 'Large Deck', 'Loft', 'Hiking Trails'],
          amenities: ['Ski Storage', 'Hot Tub'],
          yearBuilt: 2010,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 320, featured: false, verified: true, tags: ['nature', 'cabin', 'mountain', 'vacation'] },
      },
      {
        data: {
          title: 'Suburban Executive Home',
          description: 'Immaculate 5-bedroom home with office and formal dining room.',
          price: 950000,
          location: 'Oakwood Estates, Suburbia',
          bedrooms: 5,
          bathrooms: 4,
          area: 4200,
          imageUrl: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800',
          type: 'house',
          features: ['Office', 'Formal Dining', 'Chef Kitchen', '3-Car Garage'],
          amenities: ['Country Club Access', 'Security Petrol'],
          yearBuilt: 2022,
          parking: 3,
          status: 'available',
        },
        metadata: { views: 410, featured: true, verified: true, tags: ['luxury', 'executive', 'large'] },
      },
      {
        data: {
          title: 'Downtown Loft Studio',
          description: 'Industrial-style loft in a converted warehouse. High ceilings and exposed brick.',
          price: 325000,
          location: 'Arts District, Downtown',
          bedrooms: 1,
          bathrooms: 1,
          area: 750,
          imageUrl: 'https://images.unsplash.com/photo-1536376074403-062717518590?w=800',
          type: 'apartment',
          features: ['High Ceilings', 'Exposed Brick', 'Skylights', 'Industrial Finishes'],
          amenities: ['Rooftop Deck', 'Art Gallery Access'],
          yearBuilt: 1920,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 156, featured: false, verified: true, tags: ['loft', 'industrial', 'artsy'] },
      },
      {
        data: {
          title: 'Suburban Ranch Home',
          description: 'Single-story living at its finest. Recently updated 3-bedroom ranch.',
          price: 475000,
          location: 'Meadow Heights, Suburbia',
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          imageUrl: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
          type: 'house',
          features: ['Single Story', 'Updated Kitchen', 'Hardwood Floors'],
          amenities: ['Local Parks', 'Shopping Nearby'],
          yearBuilt: 1965,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 215, featured: false, verified: true, tags: ['ranch', 'convenient', 'suburban'] },
      },
      {
        data: {
          title: 'Luxury Riverside Condo',
          description: 'Live by the river in this high-end condo with private balcony and river views.',
          price: 725000,
          location: 'Riverfront District',
          bedrooms: 2,
          bathrooms: 2,
          area: 1400,
          imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
          type: 'apartment',
          features: ['River View', 'Balcony', 'Modern Finishes'],
          amenities: ['Boat Docking', 'Pool', 'Fitness Center'],
          yearBuilt: 2019,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 345, featured: true, verified: true, tags: ['river', 'luxury', 'condo'] },
      },
      {
        data: {
          title: 'Charming Cottage',
          description: 'A storybook cottage with a beautiful English garden in a quiet lane.',
          price: 425000,
          location: 'Heritage Village, Rural',
          bedrooms: 2,
          bathrooms: 1,
          area: 950,
          imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
          type: 'house',
          features: ['English Garden', 'Stone Walls', 'Thatch Roof Style'],
          amenities: ['Village Green', 'Local Pub Nearby'],
          yearBuilt: 1940,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 278, featured: false, verified: true, tags: ['cottage', 'charm', 'heritage'] },
      },
      {
        data: {
          title: 'Modern Suburban Townhouse',
          description: 'Efficient and stylish 3-story townhouse with rooftop terrace.',
          price: 595000,
          location: 'Greenfield Square, Suburbia',
          bedrooms: 3,
          bathrooms: 2.5,
          area: 1900,
          imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800',
          type: 'house',
          features: ['Rooftop Terrace', 'Smart Home', 'Energy Efficient'],
          amenities: ['Walkable Area', 'Coffee Shops', 'Boutiques'],
          yearBuilt: 2021,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 198, featured: true, verified: true, tags: ['townhouse', 'modern', 'terrace'] },
      },
      {
        data: {
          title: 'Spacious Lake House',
          description: 'Beautiful property with direct lake access and private dock. Great for summer fun.',
          price: 850000,
          location: 'Crystal Lake, North Country',
          bedrooms: 4,
          bathrooms: 3,
          area: 2600,
          imageUrl: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800',
          type: 'house',
          features: ['Lake Front', 'Private Dock', 'Large Deck', 'Finished Basement'],
          amenities: ['Community Gate', 'Nature Trails'],
          yearBuilt: 2012,
          parking: 3,
          status: 'available',
        },
        metadata: { views: 567, featured: true, verified: true, tags: ['lake', 'waterfront', 'vacation'] },
      },
      {
        data: {
          title: 'Minimalist Modern Apartment',
          description: 'Sleek and minimalist 1-bedroom apartment. Clean lines and natural light.',
          price: 395000,
          location: 'Up-and-Coming Neighborhood',
          bedrooms: 1,
          bathrooms: 1,
          area: 800,
          imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          type: 'apartment',
          features: ['Minimalist Design', 'Large Windows', 'Smart Lighting'],
          amenities: ['Community Garden', 'Shared Workspace'],
          yearBuilt: 2023,
          parking: 0,
          status: 'available',
        },
        metadata: { views: 234, featured: false, verified: true, tags: ['modern', 'minimalist', 'new'] },
      },
      {
        data: {
          title: 'Historic Brick Rowhouse',
          description: 'Beautifully restored 19th-century rowhouse in the historic district.',
          price: 1100000,
          location: 'Old Town, City Center',
          bedrooms: 4,
          bathrooms: 3.5,
          area: 3200,
          imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
          type: 'house',
          features: ['Historic Detail', 'Chef Kitchen', 'Patio', 'Stair Lighting'],
          amenities: ['Brick Paved Streets', 'Historic Landmark'],
          yearBuilt: 1885,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 432, featured: true, verified: true, tags: ['historic', 'architecture', 'premium'] },
      },
      {
        data: {
          title: 'Suburban Smart Home',
          description: 'Cutting-edge technology integrated into a comfortable 4-bedroom family home.',
          price: 785000,
          location: 'Tech Valley, Suburbia',
          bedrooms: 4,
          bathrooms: 3,
          area: 2800,
          imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800',
          type: 'house',
          features: ['Voice Control', 'Automated Blinds', 'Solar Panels', 'EV Charger'],
          amenities: ['Playground', 'Dog Park', 'High-Speed Grid'],
          yearBuilt: 2023,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 389, featured: true, verified: true, tags: ['smart', 'tech', 'efficiently'] },
      },
      {
        data: {
          title: 'Country Estate on 5 Acres',
          description: 'Expansive estate with main house, guest house, and barn on 5 beautiful acres.',
          price: 1750000,
          location: 'Rolling Hills, Rural',
          bedrooms: 6,
          bathrooms: 5,
          area: 5500,
          imageUrl: 'https://images.unsplash.com/photo-1500315331616-db4f707c24d1?w=800',
          type: 'house',
          features: ['Guest House', 'Barn', 'Fruit Orchard', 'Swimming Pond'],
          amenities: ['Private Road', 'Security Gate'],
          yearBuilt: 2011,
          parking: 5,
          status: 'available',
        },
        metadata: { views: 789, featured: true, verified: true, tags: ['estate', 'land', 'luxury'] },
      },
      {
        data: {
          title: 'Mid-Century Modern Gem',
          description: 'Authentic mid-century modern architecture with original features and updates.',
          price: 825000,
          location: 'Designer District, Suburbia',
          bedrooms: 3,
          bathrooms: 2,
          area: 2100,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
          type: 'house',
          features: ['Floor-to-Ceiling Windows', 'Open Plan', 'Original Fireplace'],
          amenities: ['Community Pool', 'Mature Landscaping'],
          yearBuilt: 1958,
          parking: 2,
          status: 'available',
        },
        metadata: { views: 456, featured: true, verified: true, tags: ['design', 'mid-century', 'unique'] },
      },
      {
        data: {
          title: 'Industrial Apartment Studio',
          description: 'Cool industrial space in the old textile mill. Perfect for creatives.',
          price: 295000,
          location: 'Mill District, City Center',
          bedrooms: 1,
          bathrooms: 1,
          area: 900,
          imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
          type: 'apartment',
          features: ['Concrete Floors', 'Large Factory Windows', 'High Ceilings'],
          amenities: ['Creative Studios', 'Coffee Shop in Building'],
          yearBuilt: 1910,
          parking: 1,
          status: 'available',
        },
        metadata: { views: 189, featured: false, verified: true, tags: ['industrial', 'studio', 'creative'] },
      },
      {
        data: {
          title: 'Ocean View Penthouse',
          description: 'Breathtaking ocean views from every room. Top floor luxury at its best.',
          price: 3200000,
          location: 'Seaside Bluffs, Premium Coastal',
          bedrooms: 4,
          bathrooms: 4.5,
          area: 3800,
          imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dd9b6b9?w=800',
          type: 'apartment',
          features: ['Wrap-around Deck', 'Chef Kitchen', 'Master Spa Suite', 'Private Lift'],
          amenities: ['Beach Access Club', 'Concierge', 'Rooftop Infinity Pool'],
          yearBuilt: 2022,
          parking: 3,
          status: 'available',
        },
        metadata: { views: 945, featured: true, verified: true, tags: ['luxury', 'ocean', 'penthouse'] },
      },
    ]);

    console.log('Properties seeded:', properties.length);

    // Seed favorites for John and Jane
    await favouriteRepository.save([
      {
        user: users[0], // John
        property: properties[0], // Modern Downtown Apartment
        notes: {
          userNotes: 'Love the city view!',
          rating: 5,
          tags: ['city', 'modern'],
        },
      },
      {
        user: users[0], // John
        property: properties[1], // Luxury Villa with Pool
        notes: {
          userNotes: 'A bit expensive but beautiful.',
          rating: 4,
          tags: ['luxury', 'villa'],
        },
      },
      {
        user: users[1], // Jane
        property: properties[3], // Family Home with Garden
        notes: {
          userNotes: 'Perfect for the kids.',
          rating: 5,
          tags: ['family', 'garden'],
        },
      },
      {
        user: users[1], // Jane
        property: properties[13], // Spacious Lake House
        notes: {
          userNotes: 'Dream vacation home!',
          rating: 5,
          tags: ['lake', 'vacation'],
        },
      },
    ]);

    console.log('Favourites seeded');
    console.log('Seed completed successfully!');
    console.log('\nJSONB Structure:');
    console.log('- Users: profile (name, role, preferences) + settings');
    console.log('- Properties: data (all property info) + metadata (views, tags)');
    console.log('- Favourites: notes (user notes, ratings, tags)');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
