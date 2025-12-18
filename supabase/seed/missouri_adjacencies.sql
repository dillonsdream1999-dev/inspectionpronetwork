-- Missouri Territory Adjacencies
-- Run this AFTER inserting the territories
-- This updates adjacent_ids based on geographic proximity

-- First, let's create a helper to update adjacencies by name
DO $$
DECLARE
    -- St. Louis Metro
    stl_downtown UUID;
    stl_south_city UUID;
    stl_north_county UUID;
    stl_west_county UUID;
    stl_south_county UUID;
    st_charles UUID;
    jefferson_county UUID;
    washington_union UUID;
    
    -- Kansas City Metro
    kc_downtown UUID;
    kc_north UUID;
    kc_south UUID;
    independence UUID;
    lees_summit UUID;
    blue_springs UUID;
    liberty_gladstone UUID;
    raytown_grandview UUID;
    
    -- Springfield
    springfield_central UUID;
    springfield_suburbs UUID;
    nixa_ozark UUID;
    branson UUID;
    
    -- Other metros
    columbia UUID;
    jeff_city UUID;
    joplin UUID;
    carthage UUID;
    st_joseph UUID;
    cape_girardeau UUID;
    rolla UUID;
    sedalia UUID;
    poplar_bluff UUID;
    
    -- Rural
    northeast_mo UUID;
    northwest_mo UUID;
    central_mo_north UUID;
    lake_ozarks UUID;
    southeast_mo UUID;
    southwest_mo UUID;
    south_central_mo UUID;
    west_central_mo UUID;
BEGIN
    -- Get all territory IDs
    SELECT id INTO stl_downtown FROM territories WHERE name = 'St. Louis Downtown' AND state = 'MO';
    SELECT id INTO stl_south_city FROM territories WHERE name = 'St. Louis South City' AND state = 'MO';
    SELECT id INTO stl_north_county FROM territories WHERE name = 'St. Louis North County' AND state = 'MO';
    SELECT id INTO stl_west_county FROM territories WHERE name = 'St. Louis West County' AND state = 'MO';
    SELECT id INTO stl_south_county FROM territories WHERE name = 'St. Louis South County' AND state = 'MO';
    SELECT id INTO st_charles FROM territories WHERE name = 'St. Charles County' AND state = 'MO';
    SELECT id INTO jefferson_county FROM territories WHERE name = 'Jefferson County' AND state = 'MO';
    SELECT id INTO washington_union FROM territories WHERE name = 'Washington - Union Area' AND state = 'MO';
    
    SELECT id INTO kc_downtown FROM territories WHERE name = 'Kansas City Downtown' AND state = 'MO';
    SELECT id INTO kc_north FROM territories WHERE name = 'Kansas City North' AND state = 'MO';
    SELECT id INTO kc_south FROM territories WHERE name = 'Kansas City South' AND state = 'MO';
    SELECT id INTO independence FROM territories WHERE name = 'Independence' AND state = 'MO';
    SELECT id INTO lees_summit FROM territories WHERE name = 'Lees Summit' AND state = 'MO';
    SELECT id INTO blue_springs FROM territories WHERE name = 'Blue Springs - Grain Valley' AND state = 'MO';
    SELECT id INTO liberty_gladstone FROM territories WHERE name = 'Liberty - Gladstone' AND state = 'MO';
    SELECT id INTO raytown_grandview FROM territories WHERE name = 'Raytown - Grandview' AND state = 'MO';
    
    SELECT id INTO springfield_central FROM territories WHERE name = 'Springfield Central' AND state = 'MO';
    SELECT id INTO springfield_suburbs FROM territories WHERE name = 'Springfield Suburbs' AND state = 'MO';
    SELECT id INTO nixa_ozark FROM territories WHERE name = 'Nixa - Ozark' AND state = 'MO';
    SELECT id INTO branson FROM territories WHERE name = 'Branson - Ozark Lakes' AND state = 'MO';
    
    SELECT id INTO columbia FROM territories WHERE name = 'Columbia' AND state = 'MO';
    SELECT id INTO jeff_city FROM territories WHERE name = 'Jefferson City' AND state = 'MO';
    SELECT id INTO joplin FROM territories WHERE name = 'Joplin' AND state = 'MO';
    SELECT id INTO carthage FROM territories WHERE name = 'Carthage - Webb City' AND state = 'MO';
    SELECT id INTO st_joseph FROM territories WHERE name = 'St. Joseph' AND state = 'MO';
    SELECT id INTO cape_girardeau FROM territories WHERE name = 'Cape Girardeau Area' AND state = 'MO';
    SELECT id INTO rolla FROM territories WHERE name = 'Rolla - Fort Leonard Wood' AND state = 'MO';
    SELECT id INTO sedalia FROM territories WHERE name = 'Sedalia - Warrensburg' AND state = 'MO';
    SELECT id INTO poplar_bluff FROM territories WHERE name = 'Poplar Bluff Area' AND state = 'MO';
    
    SELECT id INTO northeast_mo FROM territories WHERE name = 'Northeast Missouri' AND state = 'MO';
    SELECT id INTO northwest_mo FROM territories WHERE name = 'Northwest Missouri' AND state = 'MO';
    SELECT id INTO central_mo_north FROM territories WHERE name = 'Central Missouri North' AND state = 'MO';
    SELECT id INTO lake_ozarks FROM territories WHERE name = 'Lake of the Ozarks' AND state = 'MO';
    SELECT id INTO southeast_mo FROM territories WHERE name = 'Southeast Missouri' AND state = 'MO';
    SELECT id INTO southwest_mo FROM territories WHERE name = 'Southwest Missouri' AND state = 'MO';
    SELECT id INTO south_central_mo FROM territories WHERE name = 'South Central Missouri' AND state = 'MO';
    SELECT id INTO west_central_mo FROM territories WHERE name = 'West Central Missouri' AND state = 'MO';

    -- St. Louis Metro Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[stl_south_city, stl_north_county, stl_west_county] WHERE id = stl_downtown;
    UPDATE territories SET adjacent_ids = ARRAY[stl_downtown, stl_west_county, stl_south_county, jefferson_county] WHERE id = stl_south_city;
    UPDATE territories SET adjacent_ids = ARRAY[stl_downtown, stl_west_county, st_charles] WHERE id = stl_north_county;
    UPDATE territories SET adjacent_ids = ARRAY[stl_downtown, stl_south_city, stl_north_county, stl_south_county, st_charles, washington_union] WHERE id = stl_west_county;
    UPDATE territories SET adjacent_ids = ARRAY[stl_south_city, stl_west_county, jefferson_county, washington_union] WHERE id = stl_south_county;
    UPDATE territories SET adjacent_ids = ARRAY[stl_north_county, stl_west_county, northeast_mo] WHERE id = st_charles;
    UPDATE territories SET adjacent_ids = ARRAY[stl_south_city, stl_south_county, washington_union, southeast_mo] WHERE id = jefferson_county;
    UPDATE territories SET adjacent_ids = ARRAY[stl_west_county, stl_south_county, jefferson_county, central_mo_north, rolla] WHERE id = washington_union;

    -- Kansas City Metro Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[kc_north, kc_south, independence, raytown_grandview] WHERE id = kc_downtown;
    UPDATE territories SET adjacent_ids = ARRAY[kc_downtown, liberty_gladstone, northwest_mo] WHERE id = kc_north;
    UPDATE territories SET adjacent_ids = ARRAY[kc_downtown, raytown_grandview, lees_summit, west_central_mo] WHERE id = kc_south;
    UPDATE territories SET adjacent_ids = ARRAY[kc_downtown, blue_springs, raytown_grandview, liberty_gladstone] WHERE id = independence;
    UPDATE territories SET adjacent_ids = ARRAY[kc_south, raytown_grandview, blue_springs, west_central_mo] WHERE id = lees_summit;
    UPDATE territories SET adjacent_ids = ARRAY[independence, lees_summit, west_central_mo] WHERE id = blue_springs;
    UPDATE territories SET adjacent_ids = ARRAY[kc_north, independence, northwest_mo] WHERE id = liberty_gladstone;
    UPDATE territories SET adjacent_ids = ARRAY[kc_downtown, kc_south, independence, lees_summit] WHERE id = raytown_grandview;

    -- Springfield Area Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[springfield_suburbs, nixa_ozark] WHERE id = springfield_central;
    UPDATE territories SET adjacent_ids = ARRAY[springfield_central, nixa_ozark, south_central_mo] WHERE id = springfield_suburbs;
    UPDATE territories SET adjacent_ids = ARRAY[springfield_central, springfield_suburbs, branson] WHERE id = nixa_ozark;
    UPDATE territories SET adjacent_ids = ARRAY[nixa_ozark, south_central_mo, southwest_mo] WHERE id = branson;

    -- Central Missouri Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[jeff_city, central_mo_north, sedalia, northeast_mo] WHERE id = columbia;
    UPDATE territories SET adjacent_ids = ARRAY[columbia, central_mo_north, lake_ozarks, rolla, sedalia] WHERE id = jeff_city;
    
    -- Joplin Area Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[carthage, southwest_mo] WHERE id = joplin;
    UPDATE territories SET adjacent_ids = ARRAY[joplin, southwest_mo] WHERE id = carthage;

    -- St. Joseph Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[northwest_mo, kc_north] WHERE id = st_joseph;

    -- Southeast MO Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[cape_girardeau, poplar_bluff, jefferson_county, south_central_mo] WHERE id = southeast_mo;
    UPDATE territories SET adjacent_ids = ARRAY[southeast_mo, poplar_bluff, south_central_mo] WHERE id = cape_girardeau;
    UPDATE territories SET adjacent_ids = ARRAY[southeast_mo, cape_girardeau, south_central_mo] WHERE id = poplar_bluff;

    -- Rolla Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[washington_union, jeff_city, lake_ozarks, south_central_mo] WHERE id = rolla;

    -- Sedalia Adjacencies  
    UPDATE territories SET adjacent_ids = ARRAY[columbia, jeff_city, lake_ozarks, west_central_mo, central_mo_north] WHERE id = sedalia;

    -- Rural Region Adjacencies
    UPDATE territories SET adjacent_ids = ARRAY[st_charles, columbia, northwest_mo, central_mo_north] WHERE id = northeast_mo;
    UPDATE territories SET adjacent_ids = ARRAY[st_joseph, liberty_gladstone, kc_north, northeast_mo, west_central_mo] WHERE id = northwest_mo;
    UPDATE territories SET adjacent_ids = ARRAY[columbia, jeff_city, lake_ozarks, washington_union, northeast_mo, sedalia] WHERE id = central_mo_north;
    UPDATE territories SET adjacent_ids = ARRAY[jeff_city, rolla, central_mo_north, sedalia, south_central_mo] WHERE id = lake_ozarks;
    UPDATE territories SET adjacent_ids = ARRAY[joplin, carthage, branson, west_central_mo] WHERE id = southwest_mo;
    UPDATE territories SET adjacent_ids = ARRAY[springfield_suburbs, branson, rolla, lake_ozarks, southeast_mo, cape_girardeau, poplar_bluff] WHERE id = south_central_mo;
    UPDATE territories SET adjacent_ids = ARRAY[kc_south, lees_summit, blue_springs, sedalia, northwest_mo, southwest_mo] WHERE id = west_central_mo;

    RAISE NOTICE 'Adjacent territories updated successfully!';
END $$;

-- Verify the updates
SELECT name, array_length(adjacent_ids, 1) as adjacent_count 
FROM territories 
WHERE state = 'MO' 
ORDER BY name;

