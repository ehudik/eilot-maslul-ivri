from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
from typing import List, Tuple, Optional, Dict
import urllib.parse
import logging
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import math
from datetime import datetime, timedelta
import re 
import polyline

# --- Configuration & Initialization ---

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app) 

ORS_API_KEY = os.getenv('OPENROUTESERVICE_API_KEY')
if not ORS_API_KEY:
    logger.error("OPENROUTESERVICE_API_KEY environment variable not found. Please set it in backend/.env")
    raise ValueError("OPENROUTESERVICE_API_KEY not found in environment variables")

# --- In-memory Mock Data Store (for demo purposes) ---
mock_drivers_data = {
    "driver1": {
        "id": "driver1",
        "name": "אבי רונן",
        "base_address": "רחוב דיזנגוף 100, תל אביב",
        "max_daily_hours": 8,
        "is_available": True,
        "schedule": {
            "Monday": [
                {
                    "ride_id": "ride_1",
                    "origin_address": "רחוב דיזנגוף 100, תל אביב",
                    "destination_address": "רחוב יפו 200, ירושלים",
                    "origin_coords": [32.0757, 34.7755],
                    "destination_coords": [31.7833, 35.2167],
                    "start_time_iso": "2024-03-18T08:00:00",
                    "end_time_iso": "2024-03-18T09:30:00",
                    "duration_minutes": 90,
                    "client_name": "חברת היי-טק א'",
                    "ride_polyline_coords": [
                        [32.0757, 34.7755],
                        [32.0, 35.0],
                        [31.9, 35.1],
                        [31.7833, 35.2167]
                    ]
                },
                {
                    "ride_id": "ride_2",
                    "origin_address": "רחוב יפו 200, ירושלים",
                    "destination_address": "רחוב הרצל 50, חיפה",
                    "origin_coords": [31.7833, 35.2167],
                    "destination_coords": [32.8197, 34.9993],
                    "start_time_iso": "2024-03-18T10:00:00",
                    "end_time_iso": "2024-03-18T11:45:00",
                    "duration_minutes": 105,
                    "client_name": "משרד עורכי דין ב'",
                    "ride_polyline_coords": [
                        [31.7833, 35.2167],
                        [32.0, 35.0],
                        [32.4, 35.0],
                        [32.8197, 34.9993]
                    ]
                }
            ],
            "Tuesday": [
                {
                    "ride_id": "ride_3",
                    "origin_address": "רחוב דיזנגוף 100, תל אביב",
                    "destination_address": "רחוב אלנבי 1, באר שבע",
                    "origin_coords": [32.0757, 34.7755],
                    "destination_coords": [31.2518, 34.7913],
                    "start_time_iso": "2024-03-19T08:30:00",
                    "end_time_iso": "2024-03-19T10:45:00",
                    "duration_minutes": 135,
                    "client_name": "אוניברסיטת בן גוריון",
                    "ride_polyline_coords": [
                        [32.0757, 34.7755],
                        [31.8, 34.8],
                        [31.5, 34.8],
                        [31.2518, 34.7913]
                    ]
                }
            ],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
    },
    "driver2": {
        "id": "driver2",
        "name": "נועה כהן",
        "base_address": "רחוב יפו 200, ירושלים",
        "max_daily_hours": 8,
        "is_available": True,
        "schedule": {
            "Monday": [
                {
                    "ride_id": "ride_4",
                    "origin_address": "רחוב יפו 200, ירושלים",
                    "destination_address": "רחוב העצמאות 10, אשדוד",
                    "origin_coords": [31.7833, 35.2167],
                    "destination_coords": [31.7927, 34.6498],
                    "start_time_iso": "2024-03-18T09:00:00",
                    "end_time_iso": "2024-03-18T10:15:00",
                    "duration_minutes": 75,
                    "client_name": "נמל אשדוד",
                    "ride_polyline_coords": [
                        [31.7833, 35.2167],
                        [31.8, 35.0],
                        [31.79, 34.8],
                        [31.7927, 34.6498]
                    ]
                }
            ],
            "Tuesday": [
                {
                    "ride_id": "ride_5",
                    "origin_address": "רחוב יפו 200, ירושלים",
                    "destination_address": "רחוב הרצל 50, חיפה",
                    "origin_coords": [31.7833, 35.2167],
                    "destination_coords": [32.8197, 34.9993],
                    "start_time_iso": "2024-03-19T08:00:00",
                    "end_time_iso": "2024-03-19T09:45:00",
                    "duration_minutes": 105,
                    "client_name": "אוניברסיטת חיפה",
                    "ride_polyline_coords": [
                        [31.7833, 35.2167],
                        [32.0, 35.0],
                        [32.4, 35.0],
                        [32.8197, 34.9993]
                    ]
                }
            ],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
    },
    "driver3": {
        "id": "driver3",
        "name": "יוסף לוי",
        "base_address": "רחוב אלנבי 1, באר שבע",
        "max_daily_hours": 8,
        "is_available": True,
        "schedule": {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
    },
    "driver4": {
        "id": "driver4",
        "name": "שרה דהן",
        "base_address": "רחוב הרצל 50, חיפה",
        "max_daily_hours": 8,
        "is_available": False,
        "schedule": {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
    },
    "driver5": {
        "id": "driver5",
        "name": "משה גוטמן",
        "base_address": "רחוב העצמאות 10, אשדוד",
        "max_daily_hours": 8,
        "is_available": True,
        "schedule": {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
    }
}

mock_rides_data = {}

# --- Utility Functions for Openrouteservice API ---

def get_coordinates(address: str) -> Optional[Tuple[float, float]]:
    url = "https://api.openrouteservice.org/geocode/search"
    params = {
        "api_key": ORS_API_KEY,
        "text": address,
        "boundary.country": "IL",
        "lang": "he"
    }
    try:
        logger.info(f"--- Geocoding Attempt ---")
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        if data.get('features') and len(data['features']) > 0:
            coords = data['features'][0]['geometry']['coordinates']
            latitude, longitude = coords[1], coords[0]
            logger.info(f"Geocoding SUCCESS for '{address}': Lat={latitude}, Lon={longitude}")
            return latitude, longitude
        else:
            logger.warning(f"Geocoding FAILED for '{address}': No features found in response. Response: {response.text}")
            return None
    except requests.exceptions.Timeout:
        logger.error(f"Geocoding FAILED for '{address}': Request timed out after 15 seconds.")
        return None
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Geocoding FAILED for '{address}': Connection error - {e}")
        return None
    except requests.exceptions.HTTPError as e:
        logger.error(f"Geocoding FAILED for '{address}': HTTP Error {e.response.status_code}. Response Body: {e.response.text}")
        if e.response.status_code == 401:
            logger.error("Geocoding FAILED: Unauthorized (401). Check your Openrouteservice API key.")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during geocoding for '{address}': {e}", exc_info=True)
        return None

def get_distance_matrix(coordinates: List[Tuple[float, float]]) -> Optional[Dict]:
    if not coordinates:
        logger.warning("No coordinates provided for Distance Matrix calculation.")
        return None
    url = "https://api.openrouteservice.org/v2/matrix/driving-car"
    headers = {
        "Authorization": f"Bearer {ORS_API_KEY}",
        "Content-Type": "application/json"
    }
    ors_locations = [[coord[1], coord[0]] for coord in coordinates] 
    payload = {
        "locations": ors_locations,
        "metrics": ["duration", "distance"],
        "units": "m"
    }
    try:
        logger.info(f"--- Distance Matrix Attempt ---")
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        durations = data.get("durations")
        distances = data.get("distances")
        if durations is not None and distances is not None:
            logger.info(f"Distance Matrix SUCCESS. Returned durations and distances.")
            return {
                "durations": durations,
                "distances": distances
            }
        else:
            logger.warning(f"Distance Matrix FAILED: Missing 'durations' or 'distances' in response. Body: {response.text}")
            return None
    except requests.exceptions.Timeout:
        logger.error(f"Distance Matrix FAILED: Request timed out after 20 seconds.")
        return None
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Distance Matrix FAILED: Connection error - {e}")
        return None
    except requests.exceptions.HTTPError as e:
        logger.error(f"Distance Matrix FAILED: HTTP Error {e.response.status_code}. Response Body: {e.response.text}")
        if e.response.status_code == 401:
            logger.error("Distance Matrix FAILED: Unauthorized (401). Check your Openrouteservice API key.")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during Distance Matrix call: {e}", exc_info=True)
        return None

def get_directions_polyline(start_coords: Tuple[float, float], end_coords: Tuple[float, float]) -> Optional[Dict]:
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        "Authorization": f"Bearer {ORS_API_KEY}",
        "Content-Type": "application/json"
    }
    locations = [[start_coords[1], start_coords[0]], [end_coords[1], end_coords[0]]]
    payload = {
        "coordinates": locations,
        "instructions": False,
        "geometry": True,
        "preference": "fastest",
        "units": "m",
        "language": "he"
    }

    try:
        logger.info(f"--- Directions Polyline & Info Attempt ---")
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status()

        data = response.json()
        if data.get('routes') and len(data['routes']) > 0:
            route_info = data['routes'][0]
            
            if 'geometry' in route_info:
                if isinstance(route_info['geometry'], str):
                    try:
                        polyline_leaflet_coords = polyline.decode(route_info['geometry'])
                        logger.info("Directions Polyline SUCCESS (decoded from string).")
                    except Exception as e:
                        logger.error(f"Failed to decode polyline string: {e}", exc_info=True)
                        return None
                elif isinstance(route_info['geometry'], dict) and 'coordinates' in route_info['geometry']:
                    polyline_ors_coords = route_info['geometry']['coordinates']
                    polyline_leaflet_coords = [[c[1], c[0]] for c in polyline_ors_coords]
                    logger.info("Directions Polyline SUCCESS (from GeoJSON).")
                else:
                    logger.warning(f"Directions Polyline FAILED: Unexpected geometry type/structure. Body: {data}")
                    return None
            else:
                logger.warning(f"Directions Polyline FAILED: 'geometry' field missing in route info. Body: {data}")
                return None
            
            duration_seconds = route_info.get('summary', {}).get('duration', 0)
            distance_meters = route_info.get('summary', {}).get('distance', 0)

            return {
                "polyline_coords": polyline_leaflet_coords,
                "duration_seconds": duration_seconds,
                "distance_meters": distance_meters
            }
        else:
            logger.warning(f"Directions Polyline FAILED: No routes found in response. Body: {data}")
            return None

    except requests.exceptions.Timeout:
        logger.error("Directions Polyline FAILED: Request timed out.")
        return None
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Directions Polyline FAILED: Connection error - {e}")
        return None
    except requests.exceptions.HTTPError as e:
        logger.error(f"Directions Polyline FAILED: HTTP Error {e.response.status_code}. Response Body: {e.response.text}")
        if e.response.status_code == 401:
            logger.error("Directions Polyline FAILED: Unauthorized (401). Check your Openrouteservice API key.")
        elif e.response.status_code == 404:
            logger.error("Directions Polyline FAILED: Route not found (404). Check if addresses are routable.")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during Directions Polyline call: {e}", exc_info=True)
        return None

# --- VRP Optimization Logic (Google OR-Tools) ---

def solve_vrp(data: Dict) -> Optional[Dict]:
    logger.info("--- Starting VRP Optimization ---")
    
    num_locations = len(data['locations_coords'])
    num_vehicles = data['num_vehicles']
    depot_index = data['depot_index']

    if num_locations == 0:
        logger.error("VRP Error: No locations provided.")
        return None
    if num_vehicles == 0:
        logger.error("VRP Error: No vehicles provided.")
        return None
    if depot_index >= num_locations:
        logger.error(f"VRP Error: Depot index {depot_index} out of bounds for {num_locations} locations.")
        return None
    
    manager = pywrapcp.RoutingIndexManager(num_locations, num_vehicles, depot_index)
    routing = pywrapcp.RoutingModel(manager)

    if not data['time_matrix_seconds'] or len(data['time_matrix_seconds']) != num_locations or \
       any(len(row) != num_locations for row in data['time_matrix_seconds']):
        logger.error("VRP Error: time_matrix_seconds is missing or malformed.")
        return None
    
    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        
        if from_node < 0 or from_node >= num_locations or \
           to_node < 0 or to_node >= num_locations:
            logger.error(f"Time callback received out of bounds node indices: from {from_node}, to {to_node}. Matrix size: {num_locations}")
            return 1_000_000_000

        return data['time_matrix_seconds'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    time_dimension_name = 'Time'
    routing.AddDimension(
        transit_callback_index,
        0,
        data['max_daily_seconds'],
        True,
        time_dimension_name)
    time_dimension = routing.GetDimensionOrDie(time_dimension_name)

    for node_index in range(num_locations):
        if node_index != depot_index:
            routing.AddDisjunction([manager.NodeToIndex(node_index)], 10_000_000_000)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
    search_parameters.time_limit.seconds = 5

    solution = routing.SolveWithParameters(search_parameters)
    logger.info("VRP Solver completed.")

    output_routes = {
        "drivers_assigned_routes": [],
        "unassigned_task_ids": []
    }

    if solution:
        logger.info("VRP Solution found. Processing routes...")
        for vehicle_id in range(num_vehicles):
            index = routing.Start(vehicle_id)
            route_nodes_internal_indices = []
            route_original_task_ids_sequence = []
            total_travel_distance = 0
            total_travel_duration = 0
            total_service_duration = 0
            
            route_nodes_internal_indices.append(index)

            while not routing.IsEnd(index):
                previous_index = index
                index = solution.Value(routing.NextVar(index))
                
                from_node = manager.IndexToNode(previous_index)
                to_node = manager.IndexToNode(index)

                total_travel_distance += data['distance_matrix_meters'][from_node][to_node]
                total_travel_duration += data['time_matrix_seconds'][from_node][to_node]
                
                if not routing.IsEnd(index):
                    route_nodes_internal_indices.append(index)
                    current_node_data_index = manager.IndexToNode(index)

                    if current_node_data_index != depot_index and current_node_data_index < len(data['service_durations_seconds']):
                        total_service_duration += data['service_durations_seconds'][current_node_data_index]
                    
                    original_task_list_index = current_node_data_index - 1
                    if 0 <= original_task_list_index < len(data['task_original_ids']):
                        route_original_task_ids_sequence.append(data['task_original_ids'][original_task_list_index]) 

            route_nodes_internal_indices.append(index)

            total_route_duration_minutes = round((total_travel_duration + total_service_duration) / 60, 2)
            total_route_distance_km = round(total_travel_distance / 1000, 2)

            coords_for_directions_api = [data['locations_coords'][manager.IndexToNode(node_idx)] for node_idx in route_nodes_internal_indices]
            
            full_route_polyline_coords = []
            if len(coords_for_directions_api) > 1:
                for i in range(len(coords_for_directions_api) - 1):
                    start_segment_coords = coords_for_directions_api[i]
                    end_segment_coords = coords_for_directions_api[i+1]
                    segment_directions_info = get_directions_polyline(start_segment_coords, end_segment_coords)
                    if segment_directions_info and segment_directions_info.get('polyline_coords'):
                        full_route_polyline_coords.extend(segment_directions_info['polyline_coords'][:-1]) 
                if full_route_polyline_coords and segment_directions_info and segment_directions_info.get('polyline_coords'):
                    full_route_polyline_coords.append(segment_directions_info['polyline_coords'][-1]) 
                elif not full_route_polyline_coords and len(coords_for_directions_api) > 0:
                    full_route_polyline_coords = coords_for_directions_api
            elif len(coords_for_directions_api) == 1:
                full_route_polyline_coords = [coords_for_directions_api[0]]
            
            if not full_route_polyline_coords:
                 full_route_polyline_coords = []

            output_routes["drivers_assigned_routes"].append({
                "driver_id": data['driver_original_ids'][vehicle_id],
                "driver_name": f"נהג {data['driver_original_ids'][vehicle_id]}",
                "route_polyline_coords": full_route_polyline_coords,
                "assigned_task_ids_sequence": route_original_task_ids_sequence,
                "total_distance_km": total_route_distance_km,
                "total_duration_minutes": total_route_duration_minutes
            })
        
        all_original_task_ids = set(data['task_original_ids'])
        assigned_task_ids_flat = set()
        for route in output_routes["drivers_assigned_routes"]:
            assigned_task_ids_flat.update(route["assigned_task_ids_sequence"])
        
        output_routes["unassigned_task_ids"] = list(all_original_task_ids - assigned_task_ids_flat)

    else:
        logger.warning("No VRP solution found by OR-Tools.")

    logger.info("--- VRP Optimization Complete ---")
    return output_routes


# --- API Endpoints ---

@app.route('/api/test_matrix', methods=['POST'])
def test_matrix():
    logger.info("Received request to /api/test_matrix")
    try:
        data = request.get_json()
        if not data or 'addresses' not in data:
            logger.warning("TEST_MATRIX: Missing 'addresses' in request body.")
            return jsonify({"error": "Missing 'addresses' in request body"}), 400
            
        addresses = data['addresses']
        if not isinstance(addresses, list) or not all(isinstance(a, str) for a in addresses):
            logger.warning(f"TEST_MATRIX: Invalid 'addresses' type: {type(addresses)}")
            return jsonify({"error": "'addresses' must be a list of strings"}), 400
            
        all_coords = []
        failed_addresses_details = []
        
        for i, address in enumerate(addresses):
            coords = get_coordinates(address)
            if coords:
                all_coords.append(coords)
            else:
                failed_addresses_details.append({"index": i, "address": address, "reason": "Geocoding failed"})
        
        if not all_coords:
            logger.error("TEST_MATRIX: No valid coordinates obtained from any provided addresses after geocoding.")
            return jsonify({
                "error": "Failed to geocode all addresses",
                "details": "No valid coordinates could be obtained from any of the provided addresses. Check addresses or API key."
            }), 400
            
        matrix_results = get_distance_matrix(all_coords)
        if not matrix_results:
            logger.error("TEST_MATRIX: Failed to calculate distance/duration matrix from ORS.")
            return jsonify({
                "error": "Failed to calculate matrix",
                "details": "Could not retrieve distance/duration matrix from Openrouteservice for the geocoded coordinates."
            }), 500
            
        response_data = {
            "status": "success",
            "durations": matrix_results.get("durations"),
            "distances": matrix_results.get("distances"),
            "coordinates": all_coords
        }
        
        if failed_addresses_details:
            response_data["warnings"] = "Some addresses could not be geocoded."
            response_data["failed_addresses_details"] = failed_addresses_details
            logger.warning(f"TEST_MATRIX: Some addresses failed to geocode: {failed_addresses_details}")
            
        logger.info("TEST_MATRIX: Successfully processed matrix request.")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"TEST_MATRIX: Unexpected error in endpoint processing: {e}", exc_info=True)
        return jsonify({
            "error": "Failed to process matrix request due to unexpected error",
            "details": str(e)
        }), 500

@app.route('/api/optimize_schedule', methods=['POST'])
def optimize_schedule():
    logger.info("Received request to /api/optimize_schedule (General VRP)")
    try:
        data = request.get_json()
        tasks = data.get('tasks', [])
        drivers = data.get('drivers', [])

        if not tasks or not drivers:
            logger.warning("OPTIMIZE: Missing tasks or drivers in request. Using mock data.")
            tasks = [
                {"id": "task1", "address": "רחוב דיזנגוף 100, תל אביב", "service_duration_minutes": 15},
                {"id": "task2", "address": "רחוב אלנבי 50, תל אביב", "service_duration_minutes": 20},
                {"id": "task3", "address": "רחוב יפו 200, ירושלים", "service_duration_minutes": 10},
                {"id": "task4", "address": "רחוב הרצל 1, חיפה", "service_duration_minutes": 25},
            ]
            drivers = [
                {"id": "driverA", "name": "נהג א'", "start_address": "רחוב דיזנגוף 100, תל אביב", "end_address": "רחוב דיזנגוף 100, תל אביב", "max_daily_hours": 8, "is_available": True, "current_work_hours_today": 0},
                {"id": "driverB", "name": "נהג ב'", "start_address": "רחוב יפו 200, ירושלים", "end_address": "רחוב יפו 200, ירושלים", "max_daily_hours": 8, "is_available": True, "current_work_hours_today": 0},
            ]
            logger.info("OPTIMIZE: Using hardcoded mock data for general optimization demo.")

        # 1. Geocode all addresses (tasks + driver start/end points)
        all_unique_addresses = []
        task_original_ids_list = []
        service_durations_seconds_list = [0]
        
        depot_address = drivers[0]['start_address'] if drivers else "רחוב ראשי 1, תל אביב"
        all_unique_addresses.append(depot_address)

        for task in tasks:
            all_unique_addresses.append(task['address'])
            task_original_ids_list.append(task['id'])
            service_durations_seconds_list.append(task['service_duration_minutes'] * 60)

        all_unique_coords = []
        for addr in all_unique_addresses:
            coords = get_coordinates(addr)
            if coords:
                all_unique_coords.append(coords)
            else:
                logger.error(f"OPTIMIZE: Failed to geocode critical address for VRP: {addr}")
                return jsonify({"error": "Failed to geocode one or more critical addresses for VRP optimization"}), 400

        if len(all_unique_coords) != len(all_unique_addresses):
            logger.error("OPTIMIZE: Mismatch in geocoded coordinates count vs. addresses. Aborting VRP.")
            return jsonify({"error": "Failed to geocode all necessary addresses for VRP"}), 500

        available_drivers_for_vrp = [d for d in drivers if d.get('is_available', True)]
        driver_id_to_vrp_index = {d['id']: i for i, d in enumerate(available_drivers_for_vrp)}
        vrp_index_to_driver_id = [d['id'] for d in available_drivers_for_vrp]

        # 2. Get Distance Matrix
        matrix_results = get_distance_matrix(all_unique_coords)
        if not matrix_results:
            logger.error("OPTIMIZE: Failed to get distance/duration matrix for VRP.")
            return jsonify({"error": "Failed to calculate matrix for VRP optimization"}), 500
        
        time_matrix = matrix_results.get("durations")
        distance_matrix = matrix_results.get("distances")

        if not time_matrix or not distance_matrix:
            logger.error("OPTIMIZE: Matrix results are incomplete for VRP.")
            return jsonify({"error": "Incomplete matrix data for VRP optimization"}), 500

        # 3. Prepare data for OR-Tools solve_vrp
        vrp_data = {
            "locations_coords": all_unique_coords,
            "num_vehicles": len(available_drivers_for_vrp),
            "depot_index": 0,
            "service_durations_seconds": service_durations_seconds_list,
            "time_matrix_seconds": time_matrix,
            "distance_matrix_meters": distance_matrix,
            "max_daily_seconds": max(d['max_daily_hours'] * 3600 for d in available_drivers_for_vrp) if available_drivers_for_vrp else 8 * 3600,
            "task_original_ids": task_original_ids_list,
            "driver_original_ids": vrp_index_to_driver_id
        }

        # 4. Solve VRP
        optimization_solution = solve_vrp(vrp_data)

        if optimization_solution:
            logger.info("OPTIMIZE: VRP solution obtained successfully.")
            return jsonify(optimization_solution)
        else:
            logger.warning("OPTIMIZE: No VRP solution could be found by OR-Tools.")
            return jsonify({"error": "No optimal solution found", "details": "OR-Tools could not find a feasible solution for the given constraints"}), 500

    except Exception as e:
        logger.error(f"OPTIMIZE: Unexpected error during optimization process: {e}", exc_info=True)
        return jsonify({"error": "Optimization process failed due to an unexpected error", "details": str(e)}), 500

@app.route('/api/validate_task_reassignment', methods=['POST'])
def validate_task_reassignment():
    logger.info("Received request to /api/validate_task_reassignment")
    try:
        data = request.get_json()
        new_driver_id = data.get('new_driver_id')
        task_id = data.get('task_id')
        task_start_time_iso = data.get('task_start_time_iso')
        task_end_time_iso = data.get('task_end_time_iso')
        task_address = data.get('task_address')

        driver_info = mock_drivers_data.get(new_driver_id)
        if not driver_info:
            return jsonify({"is_available": False, "message": "נהג לא נמצא במערכת"}), 404

        is_available_mock = driver_info.get('is_available', False)

        driver_start_coords = get_coordinates(driver_info['base_address'])
        task_coords = get_coordinates(task_address)

        distance_to_start_km = 0
        time_to_start_minutes = 0
        
        if driver_start_coords and task_coords:
            directions_info = get_directions_polyline(driver_start_coords, task_coords)
            if directions_info:
                distance_to_start_km = round(directions_info['distance_meters'] / 1000, 2)
                time_to_start_minutes = round(directions_info['duration_seconds'] / 60, 2)
            else:
                dist_approx = math.sqrt(
                    ((driver_start_coords[0] - task_coords[0]) * 111.32)**2 + 
                    ((driver_start_coords[1] - task_coords[1]) * 111.32 * math.cos(math.radians(driver_start_coords[0])))**2
                )
                distance_to_start_km = round(dist_approx, 2)
                time_to_start_minutes = round(dist_approx / 0.8, 2)

        message = "נהג זמין והמסלול קצר." if is_available_mock else "נהג אינו זמין או לא עומד באילוצים (לדמו)."

        return jsonify({
            "is_available": is_available_mock,
            "distance_to_start_km": distance_to_start_km,
            "time_to_start_minutes": time_to_start_minutes,
            "message": message,
            "details": f"Validation for task {task_id} to driver {new_driver_id}"
        })
    except Exception as e:
        logger.error(f"VALIDATE: Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Validation failed", "details": str(e)}), 500


@app.route('/api/suggest_alternative_drivers', methods=['POST'])
def suggest_alternative_drivers():
    logger.info("Received request to /api/suggest_alternative_drivers")
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        task_start_time_iso = data.get('task_start_time_iso')
        task_end_time_iso = data.get('task_end_time_iso')
        task_address = data.get('task_address')
        exclude_driver_ids = data.get('exclude_driver_ids', [])

        alternative_drivers = []
        task_coords = get_coordinates(task_address)
        if not task_coords:
            logger.warning(f"SUGGEST: Cannot geocode task address {task_address} for suggestions.")
            return jsonify({"error": "Could not geocode task address for suggestions"}), 400

        current_day_of_week = datetime.now().strftime('%A') 

        for driver_id, driver_info in mock_drivers_data.items():
            if driver_id in exclude_driver_ids or not driver_info.get('is_available', False):
                continue
            
            driver_start_coords = get_coordinates(driver_info['base_address'])
            if not driver_start_coords:
                logger.warning(f"SUGGEST: Cannot geocode driver {driver_id} base address {driver_info['base_address']}.")
                continue

            directions_info = get_directions_polyline(driver_start_coords, task_coords)
            distance_to_start_km = 0
            time_to_start_minutes = 0
            if directions_info:
                distance_to_start_km = round(directions_info['distance_meters'] / 1000, 2)
                time_to_start_minutes = round(directions_info['duration_seconds'] / 60, 2)
            else:
                dist_approx = math.sqrt(
                    ((driver_start_coords[0] - task_coords[0]) * 111.32)**2 + 
                    ((driver_start_coords[1] - task_coords[1]) * 111.32 * math.cos(math.radians(driver_start_coords[0])))**2
                )
                distance_to_start_km = round(dist_approx, 2)
                time_to_start_minutes = round(dist_approx / 0.8, 2)
            
            task_duration_minutes_mock = 30
            total_ride_time_for_driver = time_to_start_minutes + task_duration_minutes_mock
            
            current_daily_work_minutes = sum([entry.get('duration_minutes', 0) for entry in driver_info['schedule'].get(current_day_of_week, [])])
            
            can_fit_in_schedule = (current_daily_work_minutes + total_ride_time_for_driver) <= (driver_info['max_daily_hours'] * 60)

            is_available_for_slot = driver_info.get('is_available', False) and can_fit_in_schedule
            
            if is_available_for_slot:
                alternative_drivers.append({
                    "driver_id": driver_info['id'],
                    "driver_name": driver_info['name'],
                    "is_available_for_slot": is_available_for_slot,
                    "distance_to_start_km": distance_to_start_km,
                    "time_to_start_minutes": time_to_start_minutes,
                    "base_address_coords": driver_start_coords # ADDED: driver's base address coordinates
                })
        
        alternative_drivers.sort(key=lambda x: (not x['is_available_for_slot'], x['distance_to_start_km']))

        return jsonify({
            "alternative_drivers": alternative_drivers[:5],
            "message": "הנה 5 הנהגים המומלצים ביותר.",
            "details": "Suggestions based on mock logic and ORS data."
        })
    except Exception as e:
        logger.error(f"SUGGEST: Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Suggestion failed", "details": str(e)}), 500

@app.route('/api/autocomplete_address', methods=['GET'])
def autocomplete_address():
    logger.info("Received request to /api/autocomplete_address")
    try:
        query = request.args.get('query', '')
        if not query:
            return jsonify({"suggestions": []})

        url = "https://api.openrouteservice.org/geocode/autocomplete"
        params = {
            "api_key": ORS_API_KEY,
            "text": query,
            "boundary.country": "IL",
            "lang": "he"
        }
        
        params["point.lat"] = 31.771959
        params["point.lon"] = 35.217018
        params["sources"] = "osm"

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        suggestions = []
        if data.get('features'):
            for feature in data['features']:
                if feature.get('properties') and feature['properties'].get('label'):
                    full_label = feature['properties']['label']
                    match = re.match(r'^(.*?),\s*(.*?),\s*([^,]+),\s*Israel', full_label)
                    if match:
                        street_address = match.group(1)
                        city = match.group(2)
                        suggestions.append(f"{street_address}, {city}")
                    else:
                        parts = full_label.split(', ')
                        if len(parts) >= 2:
                            suggestions.append(f"{parts[0]}, {parts[1]}")
                        else:
                            suggestions.append(full_label)
        
        suggestions = list(dict.fromkeys(suggestions))[:10]
        
        return jsonify({"suggestions": suggestions})

    except requests.exceptions.Timeout:
        logger.error("AUTOCOMPLETE: Request timed out.")
        return jsonify({"error": "Autocomplete service timed out"}), 500
    except requests.exceptions.ConnectionError as e:
        logger.error(f"AUTOCOMPLETE: Connection error - {e}")
        return jsonify({"error": "Autocomplete connection error"}), 500
    except requests.exceptions.HTTPError as e:
        logger.error(f"AUTOCOMPLETE: HTTP Error {e.response.status_code}. Body: {e.response.text}")
        if e.response.status_code == 401:
            logger.error("AUTOCOMPLETE: Unauthorized (401). Check your Openrouteservice API key.")
        return jsonify({"error": f"Autocomplete API error: {e.response.status_code}"}), 500
    except Exception as e:
        logger.error(f"AUTOCOMPLETE: Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Autocomplete failed due to unexpected error"}), 500

@app.route('/api/request_ride', methods=['POST'])
def request_ride():
    logger.info("Received request to /api/request_ride")
    try:
        data = request.get_json()
        ride_id = f"ride_{len(mock_rides_data) + 1}"
        origin_address = data.get('origin_address')
        destination_address = data.get('destination_address')
        required_arrival_time_str = data.get('required_arrival_time')
        num_passengers = data.get('num_passengers')
        client_name = data.get('client_name')
        is_recurring = data.get('is_recurring', False)
        recurring_days = data.get('recurring_days', []) if is_recurring else []

        if not all([origin_address, destination_address, required_arrival_time_str, num_passengers, client_name]):
            return jsonify({"error": "חסרים שדות חובה בבקשת נסיעה"}), 400
        
        origin_coords = get_coordinates(origin_address)
        destination_coords = get_coordinates(destination_address)

        if not origin_coords or not destination_coords:
            logger.error(f"REQUEST_RIDE: Failed to geocode origin ({origin_address}) or destination ({destination_address}).")
            return jsonify({"error": "כתובת מוצא או יעד לא נמצאה"}), 400

        directions_info = get_directions_polyline(origin_coords, destination_coords)
        if not directions_info:
            logger.error(f"REQUEST_RIDE: Failed to get directions for ride from {origin_address} to {destination_address}.")
            return jsonify({"error": "כשל בחישוב מסלול עבור הנסיעה"}), 500

        estimated_travel_time_seconds = directions_info['duration_seconds']
        estimated_distance_meters = directions_info['distance_meters']
        ride_polyline_coords = directions_info['polyline_coords']

        try:
            arrival_time_today = datetime.now().replace(
                hour=int(required_arrival_time_str.split(':')[0]),
                minute=int(required_arrival_time_str.split(':')[1]),
                second=0, microsecond=0
            )
            estimated_start_time = arrival_time_today - timedelta(seconds=estimated_travel_time_seconds)
            estimated_start_time_iso = estimated_start_time.isoformat()
            estimated_end_time_iso = arrival_time_today.isoformat()
        except ValueError:
            logger.error(f"REQUEST_RIDE: Invalid time format: {required_arrival_time_str}")
            return jsonify({"error": "פורמט שעת הגעה נדרשת אינו תקין"}), 400

        new_ride = {
            "id": ride_id,
            "origin_address": origin_address,
            "destination_address": destination_address,
            "origin_coords": origin_coords,
            "destination_coords": destination_coords,
            "required_arrival_time": required_arrival_time_str,
            "num_passengers": num_passengers,
            "client_name": client_name,
            "is_recurring": is_recurring,
            "recurring_days": recurring_days,
            "estimated_travel_time_seconds": estimated_travel_time_seconds,
            "estimated_distance_meters": estimated_distance_meters,
            "ride_polyline_coords": ride_polyline_coords,
            "estimated_start_time_iso": estimated_start_time_iso,
            "estimated_end_time_iso": estimated_end_time_iso,
            "assigned_driver_id": None,
            "assigned_driver_name": None,
            "status": "pending"
        }
        mock_rides_data[ride_id] = new_ride
        logger.info(f"REQUEST_RIDE: New ride {ride_id} created and stored.")

        suggestion_payload = {
            "task_id": ride_id,
            "task_address": origin_address,
            "task_start_time_iso": estimated_start_time_iso,
            "task_end_time_iso": estimated_end_time_iso,
            "exclude_driver_ids": []
        }
        suggested_drivers_response = suggest_alternative_drivers_internal(suggestion_payload)
        
        if suggested_drivers_response.get("error"):
             logger.warning(f"REQUEST_RIDE: Failed to get driver suggestions: {suggested_drivers_response.get('error')}")
             return jsonify({
                "ride_id": ride_id,
                "message": "בקשה נרשמה בהצלחה, אך לא ניתן היה להציע נהגים כרגע.",
                "details": "כשל בהצעת נהגים",
                "suggested_drivers": []
            }), 200

        return jsonify({
            "ride_id": ride_id,
            "message": "בקשה נרשמה בהצלחה. הנהגים המומלצים:",
            "suggested_drivers": suggested_drivers_response.get('alternative_drivers', []),
            "ride_details": {
                "origin_coords": origin_coords,
                "destination_coords": destination_coords,
                "ride_polyline_coords": ride_polyline_coords,
                "estimated_start_time_iso": estimated_start_time_iso,
                "estimated_end_time_iso": estimated_end_time_iso,
                "estimated_travel_time_seconds": estimated_travel_time_seconds
            }
        })

    except Exception as e:
        logger.error(f"REQUEST_RIDE: Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Failed to process ride request due to unexpected error", "details": str(e)}), 500

def suggest_alternative_drivers_internal(payload: Dict) -> Dict:
    task_id = payload.get('task_id')
    task_address = payload.get('task_address')
    task_start_time_iso = payload.get('task_start_time_iso')
    task_end_time_iso = payload.get('task_end_time_iso')
    exclude_driver_ids = payload.get('exclude_driver_ids', [])

    alternative_drivers = []
    task_coords = get_coordinates(task_address)
    if not task_coords:
        return {"error": "Could not geocode task address for suggestions (internal)"}

    current_day_of_week = datetime.now().strftime('%A') 

    for driver_id, driver_info in mock_drivers_data.items():
        if driver_id in exclude_driver_ids or not driver_info.get('is_available', False):
            continue
        
        driver_start_coords = get_coordinates(driver_info['base_address'])
        if not driver_start_coords:
            logger.warning(f"SUGGEST_INTERNAL: Cannot geocode driver {driver_id} base address {driver_info['base_address']}.")
            continue

        directions_info = get_directions_polyline(driver_start_coords, task_coords)
        distance_to_start_km = 0
        time_to_start_minutes = 0
        if directions_info:
            distance_to_start_km = round(directions_info['distance_meters'] / 1000, 2)
            time_to_start_minutes = round(directions_info['duration_seconds'] / 60, 2)
        else:
            dist_approx = math.sqrt(
                ((driver_start_coords[0] - task_coords[0]) * 111.32)**2 + 
                ((driver_start_coords[1] - task_coords[1]) * 111.32 * math.cos(math.radians(driver_start_coords[0])))**2
            )
            distance_to_start_km = round(dist_approx, 2)
            time_to_start_minutes = round(dist_approx / 0.8, 2)
            
        task_duration_minutes_mock = 30
        total_ride_time_for_driver = time_to_start_minutes + task_duration_minutes_mock
        
        current_daily_work_minutes = sum([entry.get('duration_minutes', 0) for entry in driver_info['schedule'].get(current_day_of_week, [])])
        
        can_fit_in_schedule = (current_daily_work_minutes + total_ride_time_for_driver) <= (driver_info['max_daily_hours'] * 60)

        is_available_for_slot = driver_info.get('is_available', False) and can_fit_in_schedule
        
        if is_available_for_slot:
            alternative_drivers.append({
                "driver_id": driver_info['id'],
                "driver_name": driver_info['name'],
                "is_available_for_slot": is_available_for_slot,
                "distance_to_start_km": distance_to_start_km,
                "time_to_start_minutes": time_to_start_minutes,
                "base_address_coords": driver_start_coords # ADDED: driver's base address coordinates
            })
    
    alternative_drivers.sort(key=lambda x: (not x['is_available_for_slot'], x['distance_to_start_km']))

    return {
        "alternative_drivers": alternative_drivers[:5],
        "message": "הנה 5 הנהגים המומלצים ביותר (פנימי)."
    }

@app.route('/api/assign_ride', methods=['POST'])
def assign_ride():
    logger.info("Received request to /api/assign_ride")
    try:
        data = request.get_json()
        ride_id = data.get('ride_id')
        driver_id = data.get('driver_id')
        estimated_start_time_iso = data.get('estimated_start_time_iso')
        
        ride_info = mock_rides_data.get(ride_id)
        driver_info = mock_drivers_data.get(driver_id)

        if not ride_info or not driver_info:
            return jsonify({"error": "נסיעה או נהג לא נמצאו"}), 404
        
        ride_info['assigned_driver_id'] = driver_id
        ride_info['assigned_driver_name'] = driver_info['name']
        ride_info['status'] = "assigned"
        ride_info['estimated_start_time_iso'] = estimated_start_time_iso
        mock_rides_data[ride_id] = ride_info

        assigned_day = datetime.fromisoformat(estimated_start_time_iso).strftime('%A')
        
        origin_coords = ride_info['origin_coords']
        destination_coords = ride_info['destination_coords']
        driver_base_coords = get_coordinates(driver_info['base_address'])

        total_task_duration_minutes = 0
        if driver_base_coords and origin_coords and destination_coords:
            travel_to_origin_info = get_directions_polyline(driver_base_coords, origin_coords)
            if travel_to_origin_info:
                total_task_duration_minutes += round(travel_to_origin_info['duration_seconds'] / 60, 2)
            else:
                 dist_approx = math.sqrt(
                    ((driver_base_coords[0] - origin_coords[0]) * 111.32)**2 + 
                    ((driver_base_coords[1] - origin_coords[1]) * 111.32 * math.cos(math.radians(driver_base_coords[0])))**2
                )
                 total_task_duration_minutes += round(dist_approx / 0.8, 2)

            total_task_duration_minutes += round(ride_info['estimated_travel_time_seconds'] / 60, 2)
        else:
            total_task_duration_minutes += 30

        new_schedule_entry = {
            "ride_id": ride_id,
            "origin_address": ride_info['origin_address'],
            "destination_address": ride_info['destination_address'],
            "start_time_iso": estimated_start_time_iso,
            "end_time_iso": (datetime.fromisoformat(estimated_start_time_iso) + timedelta(minutes=total_task_duration_minutes)).isoformat(),
            "duration_minutes": total_task_duration_minutes
        }
        
        if assigned_day not in driver_info['schedule']:
            driver_info['schedule'][assigned_day] = []
        driver_info['schedule'][assigned_day].append(new_schedule_entry)
        
        driver_info['schedule'][assigned_day].sort(key=lambda x: datetime.fromisoformat(x['start_time_iso']))

        mock_drivers_data[driver_id] = driver_info
        logger.info(f"ASSIGN_RIDE: Ride {ride_id} assigned to driver {driver_id}. Driver schedule updated.")
        
        return jsonify({
            "status": "success",
            "message": "נסיעה שובצה בהצלחה!",
            "assigned_ride_details": ride_info,
            "driver_updated_schedule": driver_info['schedule'].get(assigned_day, [])
        })
    except Exception as e:
        logger.error(f"ASSIGN_RIDE: Unexpected error: {e}", exc_info=True)
        return jsonify({"error": "Failed to assign ride due to unexpected error", "details": str(e)}), 500

@app.route('/api/drivers_with_schedules', methods=['GET'])
def get_all_drivers_with_schedules():
    logger.info("Received request to /api/drivers_with_schedules")
    try:
        drivers_list = []
        
        for driver_id, driver_info in mock_drivers_data.items():
            # Get coordinates for driver's base address
            base_address_coords = get_coordinates(driver_info['base_address'])
            
            # Create driver dictionary with all required information
            driver_dict = {
                "id": driver_info['id'],
                "name": driver_info['name'],
                "base_address": driver_info['base_address'],
                "base_address_coords": base_address_coords,
                "max_daily_hours": driver_info['max_daily_hours'],
                "is_available": driver_info['is_available'],
                "schedule": driver_info['schedule']
            }
            
            drivers_list.append(driver_dict)
        
        logger.info(f"Returning {len(drivers_list)} drivers with their schedules")
        return jsonify(drivers_list)
        
    except Exception as e:
        logger.error(f"Error in get_all_drivers_with_schedules: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Failed to retrieve drivers with schedules",
            "details": str(e)
        }), 500

# --- Main execution (for Flask development server) ---
if __name__ == '__main__':
    logger.info("Starting Flask application in development mode.")
    app.run(debug=True, host='0.0.0.0', port=5000)
