#include <stdio.h>
#include <math.h>
#include <conio.h>

int main()
{
    int in, de, tmp;
    int rgb[3] = {255, 0, 0};

    in=2;
    de=0;

    for(in=2, de=0; de!=0; tmp=in, in=(de+1)%3, de=tmp)
        for (;rgb[in] <= 255; rgb[in]+=5)
            printf("rgb= %d, %d, %d", rgb[0], rgb[1], rgb[2]);
        for (;rgb[de]>=0; rgb[de]-=5)
            printf("rgb= %d, %d, %d", rgb[0], rgb[1], rgb[2]);
}