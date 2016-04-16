#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cassert>
#include <algorithm>
#include <vector>
using namespace std;

int r[62][102];

bool check(int x, int y, int xD, int yD){
    //xD and yD must one be 0 and be 1/-1
    assert(!(xD * yD));
    assert(xD + yD);
    
    //check forward
    if (r[x+xD][y+yD] == 1)
        return false;
    
    //if all route are blocked
    if (r[x+xD][y-yD] == 1000 && r[x-xD][y+yD] == 1000 && r[x+xD][y+yD] == 1000)
        return false;
    
    //left and right
    swap(xD, yD);
    if (r[x-xD][y-yD] == 1 || r[x+xD][y+yD] == 1)
        return false;
    
    return true;
}

bool go(int x, int y, int xD, int yD){      //direction change on x & y, exactly one to be 0
    if(r[x][y] == -1)
        return true;
    
    //1000 means this route has been checked to be false
    if(r[x][y] == 1000)
        return false;
    while(true){
        if(!check(x, y, xD, yD)){
            r[x][y] = 1000;
            return false;
        }
        int change = 1;//rand()%2;      //1/(5+1) percent to change direction
        if(!change && r[x+xD][y+yD] != 1000){
            if(go(x+xD, y+yD, xD, yD)){
                r[x][y] = 1;
                return true;
            }
        }else{
            int goN = rand()%4 - 1;
            if (goN == 2)
                goN = 0;
            int goE = 0;
            if (!goN){
                while (!goE)
                    goE = rand()%3 - 1;
            }
            
            if (goN + yD == 0 && goE + xD == 0)   // you cannot go back
                continue;
            
            // cout << "going to " << goE << " " << goN << endl;

            if(go(x+goE, y+goN, goE, goN)){
                r[x][y] = 1;
                return true;
            }else{
                continue;
            }
        }
    }
}

int main(){
    srand((unsigned int)time(NULL));
    for(int i=0; i<62; i++){
        for(int j=0; j<102; j++){
            r[i][j] = 0;
        }
    }
    for(int i=0; i<62; i++){
        r[i][0] = -1;
        r[i][101] = -1;
    }
    for(int i=0; i<102; i++){
        r[0][i] = -1;
        r[61][i] = -1;
    }
    r[30][50] = 1;
    int goN = rand()%3 - 1;
    int goE = 0;
    if (!goN){
        while (!goE)
            goE = rand()%3 - 1;
    }
//    cout << "outside " << goE << " " << goN <<endl;
    go(30, 50, goE, goN);

    //visualize the map
    
    // for(int i=1; i<61; i++){
    //     for(int j=1; j<101; j++){
    //         if(r[i][j] == 1)
    //             cout << " ";
    //         else if(r[i][j] == 1000)
    //             cout << "#";
    //         else
    //             cout << "*";
    //     }
    //     cout << endl;
    // }
    
    //output map for js
    vector<int> ox;
    vector<int> oy;
    for(int i=1; i<61; i++){
        for(int j=1; j<101; j++){
            if(r[i][j] == 1){
              ox.push_back(i);
              oy.push_back(j);
            }
        }
    }
    cout << "var ox = [";
    for(int i=0, len=ox.size(); i<len-1; i++){
      cout << "\"" << ox[i] << "\", ";
    }
    cout << "\"" << ox[ox.size()-1] << "\"];\n";
    
    cout << "var oy = [";
    for(int i=0, len=oy.size(); i<len-1; i++){
      cout << "\"" << oy[i] << "\", ";
    }
    cout << "\"" << oy[oy.size()-1] << "\"];\n";
    return 0; 
}