// Mock data for MVP demonstration
// All data is fictional and for demonstration purposes only

import room1Img from "@/assets/room-1.jpg";
import room2Img from "@/assets/room-2.jpg";
import room3Img from "@/assets/room-3.jpg";
import room4Img from "@/assets/room-4.jpg";
import room5Img from "@/assets/room-5.jpg";
import room6Img from "@/assets/room-6.jpg";
 
 export interface Room {
   id: string;
   postcode: string;
   area: string;
   rent: number;
   billsIncluded: boolean;
   ensuite: boolean;
   roomType: "single" | "double" | "large double";
   available: Date;
   images: string[];
   landlordId: string;
   status: "active" | "let" | "pending";
   createdAt: Date;
   views: number;
   enquiries: number;
 }
 
 export interface PostcodeMetrics {
   postcode: string;
   area: string;
   activeRooms: number;
   avgRent: number;
   enquiryRate: number;
   avgTimeToLet: number;
   saturationScore: number;
   opportunityScore: number;
   demandTrend: "rising" | "stable" | "falling";
   searchVolume: number;
 }
 
 export const mockRooms: Room[] = [
   {
     id: "1",
     postcode: "M14 5RX",
     area: "Fallowfield, Manchester",
     rent: 550,
     billsIncluded: true,
     ensuite: false,
     roomType: "double",
     available: new Date("2024-02-15"),
    images: [room1Img],
     landlordId: "l1",
     status: "active",
     createdAt: new Date("2024-01-20"),
     views: 234,
     enquiries: 12,
   },
   {
     id: "2",
     postcode: "LS6 2AB",
     area: "Headingley, Leeds",
     rent: 475,
     billsIncluded: true,
     ensuite: true,
     roomType: "double",
     available: new Date("2024-02-01"),
    images: [room2Img],
     landlordId: "l2",
     status: "active",
     createdAt: new Date("2024-01-15"),
     views: 189,
     enquiries: 8,
   },
   {
     id: "3",
     postcode: "B29 6BD",
     area: "Selly Oak, Birmingham",
     rent: 425,
     billsIncluded: false,
     ensuite: false,
     roomType: "single",
     available: new Date("2024-02-10"),
    images: [room3Img],
     landlordId: "l3",
     status: "active",
     createdAt: new Date("2024-01-18"),
     views: 156,
     enquiries: 5,
   },
   {
     id: "4",
     postcode: "NG7 2RD",
     area: "Lenton, Nottingham",
     rent: 495,
     billsIncluded: true,
     ensuite: true,
     roomType: "large double",
     available: new Date("2024-03-01"),
    images: [room4Img],
     landlordId: "l1",
     status: "active",
     createdAt: new Date("2024-01-22"),
     views: 312,
     enquiries: 18,
   },
   {
     id: "5",
     postcode: "BS6 5QX",
     area: "Redland, Bristol",
     rent: 625,
     billsIncluded: true,
     ensuite: false,
     roomType: "double",
     available: new Date("2024-02-20"),
    images: [room5Img],
     landlordId: "l4",
     status: "active",
     createdAt: new Date("2024-01-25"),
     views: 278,
     enquiries: 14,
   },
   {
     id: "6",
     postcode: "S11 8TN",
     area: "Ecclesall, Sheffield",
     rent: 450,
     billsIncluded: false,
     ensuite: false,
     roomType: "double",
     available: new Date("2024-02-08"),
     images: [room6Img],
     landlordId: "l5",
     status: "active",
     createdAt: new Date("2024-01-12"),
     views: 145,
     enquiries: 6,
   },
 ];
 
 export const mockPostcodeMetrics: PostcodeMetrics[] = [
   {
     postcode: "M14",
     area: "Fallowfield, Manchester",
     activeRooms: 47,
     avgRent: 545,
     enquiryRate: 8.2,
     avgTimeToLet: 12,
     saturationScore: 72,
     opportunityScore: 68,
     demandTrend: "rising",
     searchVolume: 1250,
   },
   {
     postcode: "LS6",
     area: "Headingley, Leeds",
     activeRooms: 38,
     avgRent: 485,
     enquiryRate: 6.8,
     avgTimeToLet: 15,
     saturationScore: 58,
     opportunityScore: 74,
     demandTrend: "stable",
     searchVolume: 980,
   },
   {
     postcode: "B29",
     area: "Selly Oak, Birmingham",
     activeRooms: 52,
     avgRent: 420,
     enquiryRate: 5.4,
     avgTimeToLet: 18,
     saturationScore: 81,
     opportunityScore: 45,
     demandTrend: "falling",
     searchVolume: 760,
   },
   {
     postcode: "NG7",
     area: "Lenton, Nottingham",
     activeRooms: 29,
     avgRent: 475,
     enquiryRate: 9.1,
     avgTimeToLet: 9,
     saturationScore: 42,
     opportunityScore: 85,
     demandTrend: "rising",
     searchVolume: 890,
   },
   {
     postcode: "BS6",
     area: "Redland, Bristol",
     activeRooms: 24,
     avgRent: 595,
     enquiryRate: 7.5,
     avgTimeToLet: 11,
     saturationScore: 35,
     opportunityScore: 78,
     demandTrend: "rising",
     searchVolume: 720,
   },
 ];
 
 export const ukCities = [
   "Manchester",
   "Leeds",
   "Birmingham",
   "Nottingham",
   "Bristol",
   "Sheffield",
   "Liverpool",
   "Newcastle",
   "Cardiff",
   "Edinburgh",
 ];