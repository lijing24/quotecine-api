import { MoviesService } from './movies.service';
export declare class MoviesController {
    private movies;
    constructor(movies: MoviesService);
    search(query: string): Promise<any>;
    findOne(id: string): Promise<any>;
}
